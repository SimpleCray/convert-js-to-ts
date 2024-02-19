## USING YARN (Recommend)

-   yarn install
-   yarn dev

## USING NPM

-   npm i OR npm i --legacy-peer-deps
-   npm run dev

# Documentation of Standards

---

> ❗**WORK IN PROGRESS**❗- Some items still need some fleshing out

## Introduction

This document is a guide for the standards and best practices for the project. It is meant to be a living document that will be updated as the project evolves. It is meant to be a guide, not a rule book. If you have any questions or suggestions, please feel free to reach out to the team.

Also, **please note that this codebase was originally created from a template**.

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Naming Conventions](#2-naming-conventions)
3. [Styling](#3-styling)
4. [Components](#4-components)
5. [Functions](#5-functions)

## 1. Folder Structure

```
└── src/
    ├───assets/
    │   ├───images/
    │   │    └───<componentName><ReferenceName>Image.<filetype>
    │   ├───icons/
    │   │   └───<componentName><ReferenceName>Icon.<filetype>
    │   └───lotties/
    │       └───<componentName><ReferenceName>Lottie.json
    ├───components/
    │   └───<component-name>/
    │       ├───<ComponentName>.js
    │       ├───<ComponentName>Styles.js
    │       └───index.js
    ├───constants/
    │   └───<feature>Constants.js
    ├───feature/
    │   └───<feature-name>/
    │       ├───components/
    │       ├───assets/
    │       ├───context/
    │       ├───constants/
    │       ├───hooks/
    │       ├───<FeatureName>.js
    │       └───index.js
    ├───hooks/
    │   └───use<Feature>.js
    ├───locales/
    ├───pages/
    ├───redux/
    ├───routes/
    └───utils/
```

-   **assets**: Contains all global assets
-   **components**: Contains all global components
-   **constants**: Contains all global constants
-   **feature**: Contains all feature related files and components that will relate to a specific feature
-   **hooks**: Contains all global hooks
-   **locales**: Contains all global locales
-   **pages**: Contains all global pages (next.js)
-   **redux**: Contains all global redux files
-   **routes**: Contains all global routes
-   **utils**: Contains all global utility files

## 2. Naming Conventions

-   **Folder**: Use `kebab-case` for folder name, eg: `auth`, `user-profile`
-   **File**: Use `camelCase` for file name, eg: `index.js`
-   **Components**: Use `PascalCase` for component name, eg: `UserProfile.js`
-   **Variables**: Use `camelCase` for variable name, eg: `userProfile`
-   **Constants**: Use `UPPER_CASE` for constant name, eg: `USER_PROFILE`
-   **Functions**: Use `camelCase` for function name, eg: `getUserProfile`
-   **Hooks**: Use `camelCase` for hook name, eg: `useUserProfile`
-   **Handler**: Use `handle` prefix for handler name, eg: `handleClick`
-   **Context**: Use `camelCase` for context name, eg: `userProfileContext`

### Naming Considerations

Use **descriptive names** that explain what the variable, function, or component does. Avoid abbreviations and acronyms unless they are commonly used in your field.

Use **consistent naming** throughout your project. For example, if you have a variable called myVariable in one file, don't call it myVar in another file.

Use **prefixes or suffixes for specific types of files**, such as using index as the filename for an index file. For example, index.js.

## 3. Styling

We are using MUI for styling, so please follow the [MUI styling guide](https://mui.com/styles/basics/)

#### How to use MUI styling

-   **Global Styling**: Use `theme` for global styling, eg: `theme.palette.primary.main`
-   **Component Styling**: Use `@mui/material/styles` for component styling, eg:

**Creating Styles:**

```js
import { styled } from '@mui/material/styles';

export const Button = styled('button')({
	background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
	border: 0,
	borderRadius: 3,
	boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
	color: 'white',
	height: 48,
	padding: '0 30px',
});
```

**Using Styles:**

```js
import { Button } from './ButtonStyles';

export default function App() {
	return <Button>Styled Component</Button>;
}
```

## 4. Components

-   **Component Structure**: Use `index.js` for component structure
-   **Component Naming**: Use `PascalCase` for component name, eg: `UserProfile`
-   **Functional components should be used over class components**

❌ **Don't do this:**

```js
class MyPage extends React.Component {
	render() {
		return <div></div>;
	}
}
```

-   **Why index.js?** - It is to help import components and functions that are wrapped within a folder to make it easier to import within a file.:

**Example export:**

```js
export { default as UserProfile } from './UserProfile';
export { default as UserAlert } from './UserAlert';
```

**Example import:**

```js
import { UserProfile, UserAlert } from './components';
```

## 5. Functions

-   **Function Structure**: Use `index.js` for function structure
-   **Function Naming**: Use `camelCase` for function name, eg: `getUserProfile`
-   **Function Parameters**: Use `camelCase` for function parameters, eg: `getUserProfile(userId)`
-   **When to use a function vs arrow function**: Use a function when defining the default component output and an arrow function as a constant variable.

```js
// This is the component
export default function MyPage() {
	const [open, setOpen] = useState < boolean > false;

	// This is the constant variable
	const handleOpenModal = () => {
		setOpen(true);
	};

	return <div onClick={handleOpenModal} />;
}
```
