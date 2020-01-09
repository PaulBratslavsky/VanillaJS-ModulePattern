console.log('App.js'); 


/*****************************************
    STORAGE CONTROLLER
*****************************************/
const StorageController = (function(){
    return {
        clearLocalStorage: function() {
            localStorage.removeItem('items');
        },

        updateItemInLocalStorage: function(selectedItem) {

            const originalItems = JSON.parse(localStorage.getItem('items'));

            const updatedItems = originalItems.map( item => {
                if ( selectedItem.id === item.id ) {
                    console.log(item, 'item to update');
                    return { ...selectedItem }
                } else {
                    return item;
                }
            });

            localStorage.setItem('items', JSON.stringify(updatedItems));
        },

        deleteItemFromLocalStorage: function(selectedItem) {

            const originalItems = JSON.parse(localStorage.getItem('items'));

            const updatedItems = originalItems.filter( item => {
                return selectedItem.id !== item.id ;
            });

            localStorage.setItem('items', JSON.stringify(updatedItems));
        },

        getItemsFromLocalStorage: function() {
            
            if ( localStorage.getItem('items') !== null ) {
                return JSON.parse(localStorage.getItem('items'));
            }  else {
                return []
            }
        },

        addToLocalStorage: function(item) {
            let items = [];

            // Check if any items in Local Storage
            if ( localStorage.getItem('items') === null ) {
                
                items = [];
                // Push new Item
                items.push(item);

                // Save to storage
                localStorage.setItem('items', JSON.stringify(items));

            } else {
                items = JSON.parse(localStorage.getItem('items'));

                console.log(items, "ITEMS ARRAY")
                // Add new item 
                items.push(item);

                // Save to storage
                localStorage.setItem('items', JSON.stringify(items));
            }

            console.log(items, "ADD ITEMS TO LOCAL STORAGE");
        }
    }
})();

/*****************************************
    ITEM CONTROLLER
*****************************************/

const ItemController = (function(){ 

    /*************************************
        PRIVATE VARIABLES
    *************************************/
    
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

   
    // Data Structure / State
    let _state = {
        items: [],
        currentItem: null,
    };

    /*************************************
        PRIVATE METHODS
    *************************************/


    function _addData(name, calories) {

        let id;

        if (_state.items.length > 0) {
            id = _state.items[_state.items.length - 1].id + 1
        } else {
            id = 0;
        }

        calories = parseInt(calories);
        name = name.toLowerCase();

        const newItem = new Item(id, name, calories);
        _state.items.push(newItem);

        return newItem;

    }

    function _updateData({id, name, calories}) {
        
        calories = parseInt(calories);

        // Find Current Item and Replace
        const newState = _state.items.map( item => {
            if ( id === item.id ) {
                return new Item(id, name, calories);
            } else {
                return item;
            }
        });

        _state.items = newState;

    }

    function _removeData(id) {
        const newState = _state.items.filter( item => parseInt(id) !== item.id );
        _state.items = newState;
    }

    function _resetState() {
        _state = {
            items: [],
            currentItem: null,
        }
    }



    /*************************************
        PUBLIC METHODS
    *************************************/

    return {
        setInitialStateOnReload: function(items) {
            _state.items = items;
            console.log('initial state set');
        },

        setCurrentItem: function(itemId) {
            const filtereArray = _state.items.filter( item => parseInt(itemId) === item.id );
            const currentItem = filtereArray[0];
            _state.currentItem = currentItem;
        },

        updateItem: function(item) {
            _updateData(item);
        },

        addItems: function({name, calories}) {
            return _addData(name, calories);
        },

        removeItem: function({id, calories}) {
            _removeData(id);
        },

        getItems: function() {
            console.log(_state.items, "FROM GET ITEM FUNCTION")
            return _state.items;
        },

        getCalorieCount: function() {
            let callCount = 0;

            if ( _state.items !== [] ) {
                _state.items.forEach( item => { 
                    callCount += parseInt(item.calories) });
            }
            
            return callCount;
        },

        getCurrentItem: function() {
            return _state.currentItem;
        },

        clearAllState: function() {
            console.log('step 1');
            _resetState();
        }
    }

})();

/*****************************************
    UI CONTROLLER
*****************************************/

const UiController = (function() {

    /*************************************
        PRIVATE VARIABLES
    *************************************/

    const _UISelectors = {
        itemList: '#items-ui',
        listItems: '#items-ui li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearAll: '.clear-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        showMessage: '#show-message',
        totalCalories: '.total-calories',
    }
    
    /*************************************
        PRIVATE METHODS
    *************************************/

    function _setItemsToDom(items) {
        
        let html = '';

        items.forEach( item => {
            html += `
                <li key="${item.id}" style="margin-bottom: 10px; border-radius: 2px;" id="item-${item.id}" class="collection-item blue-grey lighten-5 blue-grey-text">
                    <strong style="text-transform: capitalize;" class="blue-grey-text">${item.name}</strong> <em class="light-blue-text" style="text-transform: uppercase; font-size: 1.4rem;">${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i id="edit-item" class="fa fa-pencil"></i>
                    </a>
                </li>
            `;
        });

        document.querySelector(_UISelectors.itemList).innerHTML = html;

    }

    function _getItemsFromForm() {

        const itemName =  document.querySelector(_UISelectors.itemName).value
        const itemCalories = document.querySelector(_UISelectors.itemCalories).value

        const data = { name: itemName, calories: itemCalories };

        if ( data.name !== '' && data.calories !=='' ) {
            return data;
        } else { 
            return { error: "Input can't be blank"}
        }

    }

    function _updateCalorieCountUI() {
        // Get Calories In Dom
        const totalCalories = document.querySelector(_UISelectors.totalCalories);

        // Get Calories State

        const currentCount = ItemController.getCalorieCount();
        console.log(typeof(currentCount));

        // Update Dom
        totalCalories.textContent = currentCount.toString();
    }

    function _showMessage(message) {
        let html = `
                <p style="margin: 0; padding: 0.25rem 0.5rem; text-align: center;" class="red darken-1 white-text">${message}</p>
            `;

            const showMessage = document.querySelector(_UISelectors.showMessage);
            showMessage.innerHTML = html;

            setTimeout( () => {
                showMessage.innerHTML = '';
            }, 2000);
    }

    function _resetFormFields() {
        document.querySelector(_UISelectors.itemName).value = '';
        document.querySelector(_UISelectors.itemCalories).value = '';
    }

    function _resetEditState() {
        _resetFormFields();
        document.querySelector(_UISelectors.addBtn).style.display = 'flex';
        document.querySelector(_UISelectors.updateBtn).style.display = 'none';
        document.querySelector(_UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(_UISelectors.backBtn).style.display = 'none';
    }

    function _showEditState() {
        _resetFormFields();
        document.querySelector(_UISelectors.addBtn).style.display = 'none';
        document.querySelector(_UISelectors.updateBtn).style.display = 'block';
        document.querySelector(_UISelectors.deleteBtn).style.display = 'block';
        document.querySelector(_UISelectors.backBtn).style.display = 'block';
    }


    /*************************************
        PUBLIC METHODS
    *************************************/

    return {

        // Show Sellected Item
        showCurrentItem: function({name, calories}) {
            document.querySelector(_UISelectors.itemName).value = name;
            document.querySelector(_UISelectors.itemCalories).value = calories;
        },

        // Get Items From Form
        getItemsFromInput: function(items) {
            return _getItemsFromForm();
        },

        // Update Calorie Count UI
        updateCalorieCountUI: function() {
            _updateCalorieCountUI();
        },

        // Reset Form Fields
        resetFormFields: function() {
            _resetFormFields();
        },

        // Show Message
        showMessage: function(message) {
            _showMessage(message);
        },

        // Set Items To Dom
        setItemsToDOM: function(items) {
            _setItemsToDom(items);
        },

        getUISelectors: function() {
            return _UISelectors;
        },

        resetEditState: function() {
            _resetEditState();
        },

        showEditState: function() {
            _showEditState();
        }
    }
})();

/*****************************************
    APP CONTROLLER
*****************************************/

const AppController = (function(ItemController, UiController, StorageController) {

    /*************************************
        PRIVATE METHODS
    *************************************/

    // Load Event Listeners
    function _loadEventListener() {

    // Get UI selectors from UiController
    const UISelectors = UiController.getUISelectors();

    /*************************************
        EVENTS
    *************************************/
    // DISABLE SUBMIT ON ENTER
    document.addEventListener('keypress', (e) => { ( e.keyCode === 13 || e.which === 13 ) && e.preventDefault(); return false; })

    // ADD ITEM EVENT
    document.querySelector(UISelectors.addBtn).addEventListener( 'click', addItemEvent );

    // EDIT ITEM EVENT
    document.querySelector(UISelectors.itemList).addEventListener( 'click', editItemEvent );

    // CANCEL EDIT ITEM EVENT
    document.querySelector(UISelectors.backBtn).addEventListener( 'click', UiController.resetEditState );

    // UPDATE ITEM EVENT
    document.querySelector(UISelectors.updateBtn).addEventListener( 'click', updateItemSelected );

    // DELETE ITEM EVENT
    document.querySelector(UISelectors.deleteBtn).addEventListener( 'click', deleteItemSelected );

    // DELETE ALL ITEM EVENT
    document.querySelector(UISelectors.clearAll).addEventListener( 'click', clearAllItems );
}

    /*************************************
        FUNCTIONS
    *************************************/ 
    function clearAllItems() {

        // Update state
        ItemController.clearAllState();

        // Clear All Local Storage
        StorageController.clearLocalStorage();

        // Get New Data State
        const state = ItemController.getItems();

        // Update Items In Dom with new State
        UiController.setItemsToDOM(state);

        // Update Total Callories Count UI
        UiController.updateCalorieCountUI();

        // Reset Edit State
        // UiController.resetEditState();

        // Reset Input
        UiController.resetFormFields();
    }

    function updateItemSelected(e) {

        // Get Selected Item Data From State
        const itemToUpdate = ItemController.getCurrentItem().id;
        console.log(itemToUpdate);

        e.preventDefault();
        
        // Get Input From Ui Controller
        const items = UiController.getItemsFromInput();

        const newObject = { id: itemToUpdate, ...items }

        if ( items.error ) {

            // alert(items.error);
            UiController.showMessage(items.error);

        } else {

            // Update Data State
            ItemController.updateItem(newObject);

            // Update Local Storage
            StorageController.updateItemInLocalStorage(newObject);

            // Get New Data State
            const state = ItemController.getItems();

            // Update Items In Dom with new State
            UiController.setItemsToDOM(state);

            // Update Total Callories Count UI
            UiController.updateCalorieCountUI();

            // Reset Edit State
            UiController.resetEditState();

            
            
        }

    }

    function deleteItemSelected() {
        // Get Selected Item Data From State
        const currentItemState = ItemController.getCurrentItem();
        
        // Remove Items From State
        ItemController.removeItem(currentItemState);

        // Delete from local storage
        StorageController.deleteItemFromLocalStorage(currentItemState);

        // Get New Data State
        const state = ItemController.getItems();

        // Update Items In Dom with new State
        UiController.setItemsToDOM(state);

        // Update Total Callories Count UI
        UiController.updateCalorieCountUI();

        // Reset Edit State
        UiController.resetEditState();

        console.log('Delete');
    }

    function editItemEvent(e) {
        if (e.target.id === 'edit-item') {

            UiController.showEditState();

            const selectedItem = e.target.parentNode.parentNode.getAttribute('key');
            ItemController.setCurrentItem(selectedItem);

            // Get Selected Item Data From State
            const currentItemState = ItemController.getCurrentItem();
            
            // Show selected items in Form
            UiController.showCurrentItem(currentItemState);
        }
    }

    function addItemEvent(e) {
        e.preventDefault();
        
        // Get Input From Ui Controller
        const items = UiController.getItemsFromInput();

        if ( items.error ) {
            // alert(items.error);
            UiController.showMessage(items.error);
        } else {
            // Update Data State
            const newItem = ItemController.addItems(items);
            console.log(newItem);

            // Get New Data State
            const state = ItemController.getItems();

            // Update Items In Dom with new State
            UiController.setItemsToDOM(state);

            // Update Total Callories Count UI
            UiController.updateCalorieCountUI();

            // ADD TO LOCAL STORAGE
            StorageController.addToLocalStorage(newItem);

            // Reset Input
            UiController.resetFormFields();

            
        }
    }

    /*************************************
        PUBLIC METHODS
    *************************************/

    return {
        init: function() {
            // Reset Edit State
            UiController.resetEditState();

            // Get Items from Items Conroller
            // const items = ItemController.getItems();

            // Get Items from Local Storage
            const itemsLocal = StorageController.getItemsFromLocalStorage();
            console.log(itemsLocal, "FROM LOCAL STORAGE");

            ItemController.setInitialStateOnReload(itemsLocal);

            // Populate List via UI Controller
            UiController.setItemsToDOM(itemsLocal);

            // Populate Total Count via UI Controller
            UiController.updateCalorieCountUI();

            // Add event listener
            _loadEventListener();

            console.log('App Initialized with ', itemsLocal );
        }
    }

})(ItemController, UiController, StorageController);


/*****************************************
    INITIALIZE APP
*****************************************/

AppController.init();
