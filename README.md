<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

# LWCAction
To use LWC as Lightning Action we need to wrap it with Aura Component. To avoid creating new not needed Aura Components, coding close Lightning Action event handlers, adding spinners, we can create generic Aura Component which will dynamically create LWC depending on Lighting Action API Name.

### How to use
1. In LWC component's '.js-meta.xml' file update 'isExposed' field:
```
<isExposed>true</isExposed>
```
2. Lightning Action should invoke Aura Component 'LWCLightningAction' / 'LWCLightningActionMedium' / 'LWCLightningActionHuge' depending on size.
3. Lightning Action API Name should be same as LWC API Name. I can advise naming LWC as 'SObjectName + ActionName + Action', example: 'quoteApplyDiscountAction'.
4. LWC should extend 'LwcAction':
```
import LwcAction from 'c/lwcAction'
export default class QuoteApplyDiscountAction extends LwcAction {}
```
5. When LWC is ready, to stop spinner, call:
```
this.ready()
```

### Features
- For closing action from LWC call: 
```
this.closeAction()
```
From template '{closeAction} accordingly:
```
<lightning-button label="Close" onclick={closeAction}></lightning-button>
```

- To show spinner:
```
this.showSpinner()
```

- To hide spinner:
```
this.hideSpinner()
```

- Id of Record from which Lighting Action was invoked is passed to LWC and can be accessed with:
```
this.recordId
```

### Additional Features
- To show Toast Message call 'showToast(title, message, variant)':
```
this.showToast('title', 'message', 'info')
```

- To simplify wire method use 'handleWire(value, (data) => {})'. If 'value.error' is not null or passed callback throw error, the Lighting Action will be closed and error will be shown with Toast Message. example:
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

- You can keep component hiden until it's ready to be presented by wrapping it with:
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
To present LWC and hide spinner call:
```
this.ready()
```
