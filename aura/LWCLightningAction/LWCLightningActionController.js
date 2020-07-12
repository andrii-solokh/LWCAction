({
    onInit : function(component, event, helper) {
        helper.init(component, event);
    },
    onСloseAction : function(component, event, helper) {
        helper.closeAction();
    },   
    onSetLoading : function(component, event, helper) {
        helper.setLoading(component, event.getParam('isLoading'));
    },
})
