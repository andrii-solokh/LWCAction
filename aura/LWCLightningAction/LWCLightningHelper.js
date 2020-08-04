({
    init : function(component) {
        this.getActionAPIName(component)
            .then(lwcName => {
                if (lwcName.replace(' ', '').length > 0) {
                    this.createComponent(component, lwcName)
                } else {
                    const reportMessage = 'If this message appears every time, be kind to report the issue here: https://github.com/andrii-solokh/LWCAction/issues'
                    this.displayError('Something went wrong, please, refresh the page.', reportMessage)
                }
            })
    },
    getActionAPIName : function(component) {
        const qaAPI = component.find("qaAPI")
        return qaAPI.getSelectedActions().then(response => {
            const actionName = response.actions[0].actionName
            return actionName.split('.')[1]
        })
    },
    createComponent : function(component, lwcName) {
        const recordId = component.get('v.recordId')
        const sObjectName = component.get('v.sObjectName')
        $A.createComponent(
            `c:${lwcName}`, {
                recordId : recordId, 
                sObjectName : sObjectName,
                onauraevent: component.getReference('c.onAuraEvent'),
                onsetloading: component.getReference('c.onSetLoading'),
            }, (lwcCmp, status, errorMessage) => {
                if (status === "SUCCESS") {
                    var body = component.get("v.body")
                    body.push(lwcCmp)
                    component.set("v.body", body)
                }
                else if (status === "INCOMPLETE") {
                    const errorMessage = 'No response from server or client is offline.'
                    this.displayError(errorMessage, errorMessage)
                    $A.enqueueAction(component.get('c.closeAction'))
                }
                else if (status === "ERROR") {
                    this.displayError(`The '${lwcName}' can't be find. Check if it's exposed.`, errorMessage)
                    $A.enqueueAction(component.get('c.closeAction'))
                }
            }
        )
    },
    fireAuraEvent: function(name, params) {
        let event = $A.get(name)
        if (params) event.setParams(params)
        event.fire()
    },
    setLoading: function(component, loading=true) {
        component.set("v.isLoading", loading)
    },
    displayError : function(message, errorMessage) {
        console.error("Error: " + errorMessage)
        this.showToast(message, 'error')
    },
    showToast: function(title, type, message) {
        let toast = $A.get('e.force:showToast')
        message = message || ' '
        toast.setParams({
            title: title,
            message: message,
            type: type
        })
        toast.fire()
    }
})
