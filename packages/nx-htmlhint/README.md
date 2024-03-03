<div align="center">

# nx-htmlhint

**[Nx](https://nx.dev) plugin to use [HTMLHint](https://htmlhint.com/) in your Nx workspace.**

![NPM Version](https://img.shields.io/npm/v/%40wrckt%2Fnx-htmlhint?style=flat-square&logo=npm)
![NPM Downloads](https://img.shields.io/npm/dw/%40wrckt%2Fnx-htmlhint?style=flat-square&logo=npm)
![NPM dev or peer Dependency Version](https://img.shields.io/npm/dependency-version/%40wrckt%2Fnx-htmlhint/peer/%40nx%2Fdevkit?style=flat-square&logo=nx)
![NPM dev or peer Dependency Version](https://img.shields.io/npm/dependency-version/%40wrckt%2Fnx-htmlhint/peer/htmlhint?style=flat-square&logo=HTML5)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mchlbrnd/wrckt/.github%2Fworkflows%2Fci.yml?style=flat-square&logo=github)
![NPM License](https://img.shields.io/npm/l/%40wrckt%2Fnx-htmlhint)
</div>

<hr/>

# 🚀 Features

nx-htmlhint provides a set tools for [Nx](https://nx.dev) to lint your projects' html with [HTMLHint](https://htmlhint.com/).

- **Executor**: Provides an executor to lint your html with HTMLHint.
- **Generators**: Helping you to configure your projects.
- **Configuration**: Per project configuration or worksace configurations.
- **Only Affected**: Uses Nx to support linting only affected projects.
- **Cache**: Uses Nx to cache already linted projects.

# 📦 Installation

**using [npm](https://npmjs.com)**

```shell
npm i -D @wrckt/nx-htmlhint
```

**using [yarn](https://yarnpkg.com)**

```shell
yarn add -D @wrckt/nx-htmlhint
```

**using [pnpm](https://pnpm.io)**

```shell
pnpm add -D @wrckt/nx-htmlhint
```

# 🛠️ Configuring HTMLHint for a project

To add a HTMLHint configuration to a project you just have to run the `@wrckt/nx-htmlhint:configuration` generator.

```shell
nx g @wrckt/nx-htmlhint:configuration --project <projectName>
```

The generator adds a `.htmlhintrc` at the project root and adds a htmlhint target to the project.

At the first run the generator installs all required dependencies. It also configures the `namedInputs` for the htmlhint targets.

# Examples

Run @wrckt/nx-htmlhint for a project

```shell
nx htmlhint <projectName>
```

Run @wrckt/nx-htmlhint for all projects

```shell
nx run-many --target=htmlhint
```

Run @wrckt/nx-htmlhint for affected projects

```shell
nx affected --target=htmlhint
```

# 📖 Documentation

## `@wrckt/nx-htmlhint:configuration` generator

Add htmlhint configuration to a project.

### Usage

Add configuration to a project:

`nx g @wrckt/nx-htmlhint:configuration --projectName projectName`

### Options

|Option|Value|Description|
|------------|------------|------------|
|`projectName`|`string`|The name of the project.|
|`withConfig`|`boolean`|Adds individual .htmlhintrc to project.|
|`skipFormat`|`boolean`|Skip formatting files.|

## `nx-htmlhint:lint` executor

Run htmlhint on a project.

Target Options can be configured in `project.json` or when the executor is invoked.

See: https://nx.dev/configuration/projectjson#targets

### Options

|Option|Value|Default|Description|
|----|----|----|----|
|`lintFilePattern`|`string`|| Single file/dir/glob to pass directly to HTMLHint executor|
|`config`|`string`|| Path to a .htmlhint configuration file.|
|`rules`|`string[]`|| List of rules to be applied by linter.|
|`rulesdir`|`string`|| Path to file or directory containing custom rules to be applied by linter.|
|`ignore`|`string[]`|| A list of patterns of files or folders to ignore.|
|`noColor`|`boolean`|`false`|Force enabling/disabling of color.|
|`warn`|`boolean`|`false`| Only warn on error. Process will always exit with code 0.|

# Compatibility with Nx and HTMLHint

**nx-htmlhint** depends on **Nx** and **HTMLHint**. This table provides the compatibility matrix between versions of **nx-htmlhint**, **Nx** and **HTMLHint**.

| nx-htmlhint Version   | Nx Version             | HTMLHint Version       |
| --------------------- | ---------------------- | ---------------------- |
| `^17.0.0 \|\| ^18.0.0`| `^17.0.0 \|\| ^18.0.0` | `^1.1.4`               |
