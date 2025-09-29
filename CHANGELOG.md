## v0.1.0 (2025-09-29)

### Feat

- **client**: resolve loading display issues​
- **client**: Add logo
- **client**: Optimize login page
- **server**: script to generate login url
- **client**: add markdown style
- **client**: add multimodal input and enhance content display​
- **client**: complete user interactions and implement deep thought content display​
- **client**: Add user information retrieval logic
- **client**: Hide conversation group list
- **client**: Add copy button to user messages that appears on hover
- **client**: add AI-generated answer disclaimer
- **client**: Implement i18n infrastructure to enable dynamic language switching in the frontend project
- **client**: implement agent conversation creation and time-sorted list
- **client**: add dynamic IP configuration to Vite
- **client**: remove AreaToggle component
- **client**: add AppType component for agent application type selection and initialization
- **client**: Support for initiating documentation development via port 5174​
- **client**: ​​Integration of OAuth authentication state in the frontend codebase​

### Fix

- **deploy**: fix packaging and deployment issues
- **deploy**: fix init script
- **client**: fix loading problem
- **client**: Update logo
- **Makefile**: fix packing process
- **client**: resolve TypeScript type specification issues​
- **client**: resolve display inconsistencies and implement badge indicators​
- **client**: correct multiple UI display issues​
- **client**: correct multiple UI display issues​
- **client**: optimize scroll performance and loading behavior​
- **client**: remove unused methods and files​
- **client**: resolve markdown rendering and thinking state indicators​
- **client**: enhance AI response display and image upload capabilities​
- **client**: Hide double quotation marks when there is no greeting
- **client**: Fix stylelint issue.
- **Makefile**: fix packing process
- **client**: improve packing process
- **client**: pre-release check
- **server**: pre-release check
- **client**: Fix logout issue
- **client**: resolve chat display issues and Safari compatibility​
- **client**: Remove logo
- **client**: prune unused dependencies​
- **client**: resolve scrollbar issues caused by KaTeX styling​
- **client**: enhance markdown theming and fix link navigation​
- **client**: Add js-cookie dependency
- **client**: prune dependencies and resolve build issues​
- **client**: conditionally render thought container and optimize chat bubble styling​
- **client**: resolve image upload line-break rendering
- **client**: Fix symlinks issue
- **client**: Update symlinks after merging main branch
- **client**: resolve new conversation creation and add chat status indicator​
- **client**: enhance button styling and sharing defaults​
- **client**: refine click target areas for share and cancel buttons​
- **client**: Fix production API base URL path calculation bug
- **client**: Change production API base URL from absolute to relative path
- **client**: Resolve missing internationalization for some content
- **client**: correct skeleton display during message sending
- **client**: update AppType component protocol to latest fields

### Refactor

- **client**: Hide unimplemented features
- **client**: Added frontend code version developed based on TDesign components

### Perf

- **client**: Update theme config

## v0.0.4 (2025-09-28)

### BREAKING CHANGE

- chat protocol changed
- chat protocol changed
- .env config format changed

### Feat

- **client/app0**: hide application selectior on only one app configed
- **client/app0**: delete conversation
- **server**: delete conversation
- **server**: account info api

### Fix

- **deploy**: build/deploy error
- **server**: redirect url problem
- **server**: redirect url problem
- **client/app**: after the cloud API is fixed, use the correct IsFromSelf property to determine who is speaking
- **client/app0**: the logout function is not working
- **server**: crash when talking with workflow application
- **.env.example**: spelling errors
- **client/app**: loading status is not displayed while thinking
- **client/app**: incorrect page bouncing on iOS devices
- **client/app**: set file type when uploading file
- **server**: file type parameter when uploading files
- **client/app**: rating button disabled after agent reply
- **server**: refine data structures in vendor interface
- **server**: default config issue
- **server**: move the sharing and rating codes to the vendor classes
- **server**: clean up unused code
- **server**: automatically import vendor class
- **client/app**: thought message response problem
- **server**: though message problem
- **client/app**: thinking box response problem
- **client/app**: table rendering style
- **client/app**: hide the recommended questions button on the shared page
- **client/app**: thinking box incorrectly disappears during multiple thought process switches
- **client/app**: the sharing page width overflow on mobile devices
- **client/app**: 'replies configured in the workflow' were not displayed
- **client/app**: fix layout issues of the thinking box

### Refactor

- **client**: move the client app into packages to best fit the mono repo style
- **server**: move file uploading codes to the vendor classes
- **server**: reorganize service configurations
- **client/app**: adjust record struct to align with the backend refactoring
- **server**: complete the vendor interface chat part, and unify the keys in the chat protocol data structure to CamelCase to align with other APIs
- **client/app**: adjust application struct to align with the backend refactoring
- **server**: abstract the 'vendor' interface, decouple Tencent Cloud ADP-related API calls from the core code

## v0.0.3 (2025-08-08)

## v0.0.2 (2025-07-10)

## v0.0.1 (2025-06-19)
