import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import dotenv from 'dotenv'
// 加载环境变量
dotenv.config()
export default typescriptEslint.config(
  // 1. 忽略文件配置
  { ignores: ['*.d.ts', '**/dist'] },
  // 2. TypeScript + Vue 核心配置
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // 自定义规则（覆盖预设规则）
    rules: {
      // 关闭"未使用变量"的报错（开发中临时变量不报错）
      'no-unused-vars': 'off',
      // 生产环境下console输出警告，开发环境允许console（方便调试）
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // 生产环境禁止debugger语句（否则警告），开发环境允许debugger
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // 允许在switch-case中直接声明变量（如case 1: let a = 1;）
      'no-case-declarations': 'off',
      // 允许变量/函数在定义前使用（默认禁止，关闭后更灵活）
      'no-use-before-define': 'off',
      // 关闭"函数括号前必须有空格"的强制要求（如function a(){}和function a (){}都允许）
      'space-before-function-paren': 'off',

      // Vue专属规则
      // 允许单单词组件名（如Header.vue，无需强制TheHeader.vue）
      'vue/multi-word-component-names': 'off',
      // 允许使用Vue保留字作为组件名（不建议，仅临时关闭）
      'vue/no-reserved-component-names': 'off',
      // 关闭"自定义事件名必须kebab-case"（允许@myEvent而非强制@my-event）
      'vue/custom-event-name-casing': 'off',
      // 关闭"HTML属性必须按固定顺序排列"（如id不必在class前）
      'vue/attributes-order': 'off',
      // 允许一个文件中定义多个组件（默认要求单文件组件）
      'vue/one-component-per-file': 'off',
      // 关闭"HTML标签闭合括号必须换行"的强制（如<div></div>可写在一行）
      'vue/html-closing-bracket-newline': 'off',
      // 关闭"每行最多属性数量限制"（允许一个标签的所有属性写在一行）
      'vue/max-attributes-per-line': 'off',
      // 关闭"多行HTML元素内容必须换行"（如<div>内容1 内容2</div>允许不换行）
      'vue/multiline-html-element-content-newline': 'off',
      // 关闭"单行HTML元素内容必须换行"（如<span>文本</span>允许不换行）
      'vue/singleline-html-element-content-newline': 'off',
      // 关闭"HTML属性名必须kebab-case"（允许:myProp而非强制:my-prop）
      'vue/attribute-hyphenation': 'off',
      // 关闭"组件props必须指定默认值"（非必填props可省略default）
      'vue/require-default-prop': 'off',
      // 关闭"组件必须显式声明emits选项"（允许隐式触发事件如this.$emit('change')）
      'vue/require-explicit-emits': 'off',
      // 强制自闭合标签规则：
      // - HTML空标签（如img）必须自闭合，普通标签（如div）不能自闭合，组件必须自闭合
      // - svg和math标签必须自闭合
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      // 忽略"标签第一个属性是否换行"的检查（如<div class="a" id="b">和分行写法都允许）
      'vue/first-attribute-linebreak': 'ignore',

      // TypeScript规则
      // 允许"未使用的表达式"（如a && b();不报错）
      '@typescript-eslint/no-unused-expressions': 'off',
      // 对未使用的变量报错，但允许以下划线_开头的变量（如_temp不报错，方便临时变量
      // 新增：解决属性换行的ESLint提示
      'vue/first-attribute-linebreak': [
        'off',
        {
          singleline: 'ignore',
          multiline: 'ignore',
        },
      ],

      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // 允许使用// @ts-ignore忽略类型错误
      '@typescript-eslint/ban-ts-ignore': 'off',
      // 允许使用// @ts-comment类注释
      '@typescript-eslint/ban-ts-comment': 'off',
      // 允许使用某些"不推荐"的类型（如Object、Function）
      '@typescript-eslint/ban-types': 'off',
      // 关闭"函数必须显式声明返回类型"的强制
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 允许使用any类型（不严格限制类型校验）
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许使用require导入模块（不强制ES6的import）
      '@typescript-eslint/no-var-requires': 'off',
      // 允许空函数（如() => {}不报错）
      '@typescript-eslint/no-empty-function': 'off',
      // 允许TypeScript变量/函数在定义前使用
      '@typescript-eslint/no-use-before-define': 'off',
      // 允许使用非空断言!（如obj!.prop不报错）
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 关闭"模块边界必须显式声明类型"的强制（如导出函数不必声明返回类型）
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  // 3. 集成 Prettier(关闭与Prettier 冲突的规则)
  eslintConfigPrettier,
)
