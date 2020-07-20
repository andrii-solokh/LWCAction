({
    init : function(component) {
        const qaAPI = component.find("qaAPI");
        qaAPI.getSelectedActions().then(response => {
            const actionName = response.actions[0].actionName;
            const lwcName = actionName.split('.')[1];
            this.createComponent(component, lwcName);
        });
    },
    createComponent : function(component, lwcName) {
        const recordId = component.get('v.recordId');
        $A.createComponent(
            `c:${lwcName}`, {
                recordId : recordId, 
                onclose_action: component.getReference('c.onСloseAction'),
                onset_loading: component.getReference('c.onSetLoading'),
            },
            function(lwcCmp, status, errorMessage) {
                if (status === "SUCCESS") {
                    var body = component.get("v.body");
                    body.push(lwcCmp);
                    component.set("v.body", body);
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.");
                }
                else if (status === "ERROR") {
                    console.error("Error: " + errorMessage);
                }
            }
        );
    },
    closeAction: function() {
        $A.get('e.force:closeQuickAction').fire();
    },
    setLoading: function(component, isLoading=true) {
        component.set("v.isLoading", isLoading);
    },
})
