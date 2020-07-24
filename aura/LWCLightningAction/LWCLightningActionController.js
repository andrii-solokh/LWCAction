({
    onInit : function(component, event, helper) {
        helper.init(component, event)
    },
    onAuraEvent : function(component, event, helper) {
        helper.fireAuraEvent(event.getParam('name'), event.getParam('params'))
    },   
    onSetLoading : function(component, event, helper) {
        helper.setLoading(component, event.getParam('isLoading'))
    },
})
