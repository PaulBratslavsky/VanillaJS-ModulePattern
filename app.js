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
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const state = {
        items: [
            { id: 0, name: 'Steak Dinner', calories: 1200 },
            { id: 1, name: 'Coffee', calories: 30 },
            { id: 2, name: 'Tom Yum Soup', calories: 500 },
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods 
    return {

        logData: function() {
            return state;
        },

        addData: function(item) {
            state.items.push(item);
        },

        getData: function() {
            return state.items;
        }
    }

})();

/*****************************************
    UI CONTROLLER
*****************************************/
const UiController = (function(){
    const UISelectors = {
        itemList: '#items-ui',
        addBtn: '.add-btn',
        backBtn: '.back-btn',
    }
    
    // Private Method
    function poulateDom(items) {
        
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

        document.querySelector(UISelectors.itemList).innerHTML = html;

    }

    // Public Methods
    return {

        showItems: function(items) {
            // Calls Private Function
            poulateDom(items);
        },

        getUISelectors: function() {
            return UISelectors;
        }
    }
})();

/*****************************************
    APP CONTROLLER
*****************************************/
const AppController = (function(ItemController, UiController){
    // Load Event Listeners
        function loadEventListener() {
        // Get UI selectors from UiController
        const UISelectors = UiController.getUISelectors();

        // Add items event
        document.querySelector(UISelectors.addBtn).addEventListener( 'click', () => {
            alert('Add Button Clicked');
        });

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener( 'click', () => {
            alert('Back Button Clicked');
        });
    }

    // Public Methods
    return {
        init: function() {

            // Get Items from Items Conroller
            const items = ItemController.getData();

            // Populate List via UI Controller
            UiController.showItems(items);

            // Add event listener
            loadEventListener();

            console.log('App Initialized with ', items );
        }
    }
})(ItemController, UiController);


/*****************************************
    INITIALIZE APP
*****************************************/

AppController.init();

// { id: 3, name: 'Ice Cream', calories: 750 }