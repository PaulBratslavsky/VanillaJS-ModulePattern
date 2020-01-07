console.log('App.js'); 


/*****************************************
    STORAGE CONTROLLER
*****************************************/
const StorageController = (function(){
    
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
    const state = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    /*************************************
        PRIVATE METHODS
    *************************************/


    function _addData(name, calories) {

        let id;
        if (state.items.length > 0) {
            id = state.items[state.items.length - 1].id + 1
        } else {
            id = 0;
        }

        calories = parseInt(calories);

        const newItem = new Item(id, name, calories);
        state.items.push(newItem);

        state.totalCalories + calories;
        console.log(state.totalCalories, "RUNNING TOTAL");

    }

    /*************************************
        PUBLIC METHODS
    *************************************/

    return {

        logData: function() {
            return state;
        },

        addData: function({name, calories}) {
            _addData(name, calories);
        },

        getData: function() {
            return state.items;
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
        addBtn: '.add-btn',
        backBtn: '.back-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        showMessage: '#show-message',
    }
    
    /*************************************
        PRIVATE METHODS
    *************************************/

    function _setItemsToDom(items) {
        
        let html = '';

        items.forEach( item => {
            html += `
                <li style="margin-bottom: 10px; border-radius: 2px;" id="item-${item.id}" class="collection-item blue-grey lighten-5 blue-grey-text">
                    <strong class="blue-grey-text">${item.name}</strong> <em class="light-blue-text" style="text-transform: uppercase; font-size: 1.4rem;">${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-pencil"></i>
                    </a>
                </li>
            `;
            console.log(item, "From Private");
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


    /*************************************
        PUBLIC METHODS
    *************************************/

    return {
        // Get Items From Form
        getItemsFromInput: function(items) {
            return _getItemsFromForm();
        },

        // Reset Form Fields
        resetFormFields: function() {
            document.querySelector(_UISelectors.itemName).value = '';
            document.querySelector(_UISelectors.itemCalories).value = '';
        },

        // Show Message
        showMessage: function(message) {

            let html = `
                <p style="margin: 0; padding: 0.25rem 0.5rem; text-align: center;" class="red darken-1 white-text">${message}</p>
            `;

            const showMessage = document.querySelector(_UISelectors.showMessage);
            showMessage.innerHTML = html;

            setTimeout( () => {
                showMessage.innerHTML = '';
            }, 2000);

        },

        // Set Items To Dom
        setItemsToDOM: function(items) {
            _setItemsToDom(items);
        },

        getUISelectors: function() {
            return _UISelectors;
        }
    }
})();

/*****************************************
    APP CONTROLLER
*****************************************/

const AppController = (function(ItemController, UiController) {

    /*************************************
        PRIVATE METHODS
    *************************************/

    // Load Event Listeners
    function _loadEventListener() {

    // Get UI selectors from UiController
    const UISelectors = UiController.getUISelectors();

    // Add items event
    document.querySelector(UISelectors.addBtn).addEventListener( 'click', (e) => {
        e.preventDefault();
        
        // Get Input From Ui Controller
        const items = UiController.getItemsFromInput();
        console.log(items);

        if ( items.error ) {
            // alert(items.error);
            UiController.showMessage(items.error);
        } else {
            // Add Data To State
            ItemController.addData(items);

            // Get Items from Items Conroller
            const state = ItemController.getData();

            // Populate List via UI Controller
            UiController.setItemsToDOM(state);

            // Reset Input
            UiController.resetFormFields();
        }
        
        
    });

        /* Back button event
        document.querySelector(UISelectors.backBtn).addEventListener( 'click', () => {
            alert('Back Button Clicked');
        }); */
    }

    /*************************************
        PUBLIC METHODS
    *************************************/

    return {
        init: function() {

            // Get Items from Items Conroller
            const items = ItemController.getData();

            // Populate List via UI Controller
            UiController.setItemsToDOM(items);

            // Add event listener
            _loadEventListener();

            console.log('App Initialized with ', items );
        }
    }

})(ItemController, UiController);


/*****************************************
    INITIALIZE APP
*****************************************/

AppController.init();
