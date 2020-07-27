<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

# LWCAction
To use LWC as Lightning Action we need to wrap it with Aura Component. Instead of creating new unnecessary Aura Components, coding close Lightning Action event handlers and adding spinners, we can create generic Aura Component which will dynamically create LWC depending on Lighting Action API Name.

### How to use
1. In LWC component's '.js-meta.xml' file update 'isExposed' field:
```
<isExposed>true</isExposed>
```
2. Lightning Action should invoke Aura Component 'LWCLightningAction' / 'LWCLightningActionMedium' / 'LWCLightningActionHuge' depending on needed size.
3. Lightning Action API Name should be the same as LWC API Name. I can advise naming LWC as 'SObjectName + ActionName + Action', example: 'quoteApplyDiscountAction'.
4. LWC should extend 'LwcAction':
```
import LwcAction from 'c/lwcAction'
export default class QuoteApplyDiscountAction extends LwcAction {}
```
5. Stop spinner when LWC is ready:
```
this.ready()
```

### Features
- Closing action from LWC: 
```
this.closeAction()
```
From template '{closeAction}' accordingly:
```
<lightning-button label="Close" onclick={closeAction}></lightning-button>
```

- Show spinner:
```
this.showSpinner()
```

- Hide spinner:
```
this.hideSpinner()
```

- Refresh view:
```
this.refreshView()
```

- Fire any Aura Event, 'this.fireAuraEvent(eventName, params):
```
this.fireAuraEvent('e.force:createRecord', { entityApiName: "Contact" })
```

- Id and sObject name of Record from which Lighting Action was invoked is passed to LWC and can be accessed with:
```
this.recordId
this.sObjectName
```
### Actions not in LwcAction context
- To close action, show or hide spinner from component other than LwcAction:
1. Import 'LwcAction':
```
import LwcAction from'c/lwcAction'
```
2. Invoke required method:
```
LwcAction.fireCloseAction(this) // close Lighting Action
LwcAction.fireShowSpinner(this) // show spinner
LwcAction.fireHideSpinner(this) // hide spinner
LwcAction.fireRefreshView(this) // refresh view
LwcAction.fireAuraEvent(this, 'e.force:createRecord', { entityApiName: "Contact" }) // call any Aura event with params
```

### Additional Features
- Show Toast Message call 'showToast(title, message, variant)':
```
this.showToast('title', 'message', 'info')
```

- To simplify wire method use 'handleWire(value, (data) => {})'. If 'value.error' is not null or passed callback throws error, the Lighting Action will be closed and error will be shown with Toast Message. 
Example:
```
@wire (getData, {accountId: '$recordId', quartersCount: '$quartersCount'}) wireData (value) {
    this.wiredData = value
    this.handleWire(value, data => {
        if (data.opportunities.length == 0) {
            throw 'No opportunities'
        }
        this.initFilters(data.opportunities)
    })
}
```

- You can keep component hidden until it's ready to be presented by wrapping it with:
```
<template if:true={isReady}></template>
```
Example:
```
<template>
  <template if:true={isReady}>
    <div>Your component</div>
  </template>
<template>
```
Present LWC and hide spinner call:
```
this.ready()
```
