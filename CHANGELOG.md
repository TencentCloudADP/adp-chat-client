## v0.3.0 (2026-02-04)

### Feat

- **client**: sync isSidePanelOverlay value with new default
- **client**: adjust default value of isSidePanelOverlay​
- **client**: rename fullscreen and fix styling inconsistencies​
- **client**: resolve HTML example styling, refactor props naming, and clean unused attributes​
- **client**: add framework examples and enhance UI display​
- **client**: adjust props, enhance documentation, fix interactions, and add React example​
- **client**: downgrade TDesign version and update interface definitions​
- **client**: update HTML and React examples for clarity and best practices​
- **client**: simplify demo and fix TDesign style consistency​
- **client**: reduce cyclomatic complexity and extract shared component interfaces​
- **client**: migrate to component-based architecture and add framework examples​
- **client**: enhance ChatList component with performance and feature improvements​
- **client**: update quick start guide and clean up unused base components
- **client**: relocate component library documentation and fix KaTeX CDN
- **client**: add component mode with demos, update docs, and upgrade dependencies​
- **adp-chat-component**: allow a simpler way to embed
- **adp-chat-component**: add adp-chat-component to allow users to embed a chat box into an existing web page
- **vendor:adp**: add support for ADP private cloud
- **server**: add third‑party account lookup and document using OpenId in custom variables when available
- **server**: add CORS config

### Fix

- **client**: center align app information on mobile devices​
- **client**: resolve type errors during build process
- **client**: enhance uploading state and optimize mobile UI display
- **client**: resolve login page layout issues and integrate share component​
- **client**: fix compilation errors, add share component, and implement code analysis​
- **client**: resolve compilation errors in production build​
- **client**: adjust menu bar width for proper layout alignment
- **client**: resolve compilation errors and application navigation issues​
- **client**: reduce cyclomatic complexity and extract shared component interfaces​
- **client**: fix build problem due to vue default import
- **app**: implement AUTO_CREATE_ACCOUNT in /account/info router
- **example**: update default paramaters
- **example**: fix html example and simplify full mode layout in all examples
- **example**: fix build problem in vue-init-example
- **adp-chat-component**: remove files that shouldn’t be committed to git, and remove the dev-only auto-init block from the chat component
- **adp-chat-component**: fix type error TS4023 about Props export
- **adp-chat-component**: add type export, fix build problems
- **pack**: fix build order
- **makefile**: add component example to make dev target
- **makefile**: add build_component target
- **makefile**: fix make dev problem
- **vendor**: fix "chunk too big" error by increasing the streaming chunk size limit
- **server**: implement AUTO_CREATE_ACCOUNT in /account/info router instead of static file router

### Refactor

- **adp-chat-component**: generate ES bundle excluding Vue and TDesign, while UMD bundle including all dependencies for browser use

## v0.2.1 (2025-12-19)

### Feat

- **deploy**: auto generate SECRET_KEY on startup if it's empty
- **server**: add support for endpoint setting of Microsoft Entra ID
- **server**: add optinon to automatically create accounts for new users
- **server**: add traffic rate limiter
- **client**: add OptionCards support
- **client**: show error message on chating
- **client**: migrate icons to sprite sheet and fix retax layout overflow​
- **client**: refine mobile responsiveness and markdown quote rendering​
- **vendor**: structure the stored content to include information such as ReasoningContent and RelatedId

### Fix

- **server**: raise orignal exception in connect_with_retry
- **client**: clear cookie and logout on AccountUnauthorized
- **deploy**: auto run pod on machine startup
- **server**: call super init in BaseError
- **server**: fix the way to get remote ip for rate limiting
- **client**: fix the relationship bewteen url paramaters <-> store, go back and forward is now working correctly
- **docs**: upgrade React and Next.js to patch security vulnerabilities
- **docs**: fix develop commands in the docs
- **docs**: fix Node.js v25 compatibility and improve Mermaid security
- **mermaid**: fix(mermaid): set securityLevel to strict to prevent XSS
- **client**: check key exists before reading value
- **deploy**: check .env file before deploy
- **server**: log an error message if the 'Vender' config was not found
- **vendor**: fallback when failing to retrieve application information
- **client**: correct data type definitions for thinking mode expansion​
- **config**: remove unnecessary vite config fallback
- **vendor**: pagination logic error in fetching records from an OpenAI-compatible vendor
- **vendor**: wrong way to send the error message
- **vendor**: disable rating button
- **vendor**: fix openai compatible vendor incorrectly using SharedConversation
- **remove-uncessary-docs**: remove uncessary docs
- **client**: script for client debugging

### Refactor

- **server**: put oauth providers in seperated classes
- **vendor**: reduce code redundancy
- **vendor**: use DisplayName instead of Comment in the config of OpenAI compatible model

## v0.2.0 (2025-10-17)

### Feat

- **client**: adjust dialog spacing and icon sizing​
- **client**: correct AI description copy text​
- **client**: enhance authentication flows and UI consistency​
- **client**: implement scrollable image upload gallery​
- **client**: resolve critical interaction issues and implement UI improvements​
- **client**: enhance voice recording and sharing experiences​
- **client**: enhance sharing UX and input handling​
- **client**: Add create conversation button
- **client**: Implement settings menu
- **client**: Add icons folder
- add github action
- update star history
- add star history on readme

### Fix

- **client**: resolve voice button display issues​
- **client**: reposition scroll-to-bottom and clean dependencies​
- **client**: clean debug logs and adjust tag dimensions​
- **client**: correct copy button text labels​
- **client**: resolve button visibility in dark mode​
- **client**: resolve file upload failure scenarios​
- **client**: Add index param for handleDeleteFile function
- **client**: Remove unused import
- **client**: Add collapse of application list
- update video url
- **client**: Fix some UI issue

### Refactor

- **client**: Refactor of chat item
- **client**: Change import method for TD icons
- **client**: Hide project title
- **client**: Refactor isMobile function
- **client**: Modify some UI
- **client**: Remove unused components
- **client**: Refactor personal account
- **client**: add application list to sidebar
- **client**: Refactor sidebar UI
- **client**: UI refactor for some components
- **client**: Refactor UI layout
- **client**: Refactor the login page UI
- **server**: use pyproject.toml and uv to manage the vitrual env

### Perf

- **client**: Reduce duplicate CSS code

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
