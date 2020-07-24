({
    init : function(component) {
        const qaAPI = component.find("qaAPI")
        qaAPI.getSelectedActions().then(response => {
            const actionName = response.actions[0].actionName
            const lwcName = actionName.split('.')[1]
            this.createComponent(component, lwcName)
        })
    },
    createComponent : function(component, lwcName) {
        const recordId = component.get('v.recordId')
        $A.createComponent(
            `c:${lwcName}`, {
                recordId : recordId, 
                onauraevent: component.getReference('c.onAuraEvent'),
                onsetloading: component.getReference('c.onSetLoading'),
            }, (lwcCmp, status, errorMessage) => {
                if (status === "SUCCESS") {
                    var body = component.get("v.body")
                    body.push(lwcCmp)
                    component.set("v.body", body)
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                    this.showToast('Error', `No response from server or client is offline.`, 'error')
                    $A.enqueueAction(component.get('c.onСloseAction'))
                }
                else if (status === "ERROR") {
                    console.error("Error: " + errorMessage)
                    this.showToast('Error', `The '${lwcName}' LWC can't be find. Check if it's exposed.`, 'error')
                    $A.enqueueAction(component.get('c.onСloseAction'))
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
    showToast: function(title, message, type) {
        let toast = $A.get('e.force:showToast')
        toast.setParams({
            title: title,
            message: message,
            type: type
        })
        toast.fire()
    }
})
