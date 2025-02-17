# Angular 风格指南

<https://angular.dev/style-guide>

[toc]

## 单一职责

### 单一规则

1. **坚持**每个文件只定义一样东西（例如服务或组件）。
2. **考虑**把文件大小限制在 400 行代码以内。

### 小函数

1. **坚持**定义简单函数
2. **考虑**限制在 75 行之内

## 命名

### 总原则

1. **坚持**所有符号使用一致的命名规则。
2. **坚持**遵循同一个模式来描述符号的特性和类型。推荐的模式为 feature.type.ts。

### 使用点和横杠来分割文件名

1. **坚持**在描述性名字中， **用横杠分割单词**
2. **坚持\*\***使用点分割描述性名字和类型\*\*
3. **坚持**遵循先描述组件特性，再描述它的类型的模式，对所有组件使用一致的类型命名规则。推荐的模式为 **feature.type.ts**
4. **坚持**使用惯用的后缀来描述类型，包括 `.service`、`.component`、`*.pipe`、`.module`、`.directive`。 必要时可以创建更多类型名，但必须注意，不要创建太多。

### 符号名与文件名

1. **坚持**为所有东西使用一致的命名约定，以它们代表的东西命名
2. **坚持**使用大写驼峰命名法来命名类
3. **坚持**在符号名后面追加约定的类型后缀（例如 Component, Directive, Module, Pipe, Service。 -》示例：HeroesComponent)
4. **坚持**在文件名后面追加约定的类型后缀（例如 .component.ts, .directive.ts, .module.ts, .pipe.ts, .service.ts。-》示例 heroes.component.ts)

### 服务名

1. **坚持**使用一致的规则命名服务，以他们的特性来命名
2. **坚持**为服务的类名加上 Service 后缀（例如，获取数据或英雄列表的服务应该命名为 DataService 或 HeroService。）

### 引导启动

- 坚持把应用的引导程序和平台相关的逻辑放到名为 main.ts 的文件里。
- 坚持在引导逻辑中包含错误处理代码。
- 避免把应用逻辑放在 main.ts 中，而应放在组件或服务里。

### 组件选择器

- 坚持使用中线命名法（dashed-case）或叫烤串命名法（kebab-case）来命名组件的元素选择器。

```typescript
@Component({
  standalone: true,
  selector: 'toh-hero-button', // 而不是：selector: 'tohHeroButton',
  templateUrl: './hero-button.component.html',
})
export class HeroButtonComponent {}
```

### 单元测试文件名

- 坚持测试规格文件名与被测试组件文件名相同。
- 坚持测试规格文件名添加 .spec 后缀。

## 应用程序结构与 NgModule

准备一个近期实施方案和一个长期的愿景。从零开始，但要考虑应用程序接下来的路往哪儿走。

所有应用程序的源代码都放到名叫 src 的目录里。 所有特性区都在自己的文件夹中，带有它们自己的 NgModule。

所有内容都遵循每个文件一个特性的原则。每个组件、服务和管道都在自己的文件里。 所有第三方程序包保存到其它目录里，而不是 src 目录。 你不会修改它们，所以不希望它们弄乱你的应用程序。 使用本指南介绍的文件命名约定。

### 总体结构的指导原则

1. **坚持**从零开始，但要考虑应用程序接下来的路往哪儿走。
2. **坚持**有一个近期实施方案和一个长期的愿景。
3. **坚持**把所有源代码都放到名为 src 的目录里。
4. **坚持**如果组件具有多个伴生文件 (.ts、.html、.css 和 .spec)，就为它创建一个文件夹。

### 按特性组织目录结构

1. **坚持**根据特性区命名目录。
   为何？开发人员可以快速定位代码，扫一眼就能知道每个文件代表什么，目录尽可能保持扁平，既没有重复也没有多余的名字。
   当文件较多时，例如超过 10 个，使用一致的文件夹结构更容易定位它们，而在扁平结构中则更难。

### 特性模块

1. **坚持**为应用中每个明显的特性创建一个 NgModule。
2. **坚持**把特性模块放在与特性区同名的目录中（例如 app/heroes）
3. **坚持**特性模块的文件名应该能反应特性区的名字和目录（例如 app/heroes/heroes.module.ts）
4. **坚持**特性模块的符号名应该能反映出特性区、目录和文件名（例如在 app/heroes/heroes.module.ts 中定义 HeroesModule）。

### 共享特性模块

1. **坚持**在 shared 目录中创建名叫 SharedModule 的特性模块（例如在 app/shared/shared.module.ts 中定义 SharedModule）。
2. **坚持**在共享模块中声明那些可能被特性模块引用的可复用组件、指令和管道。
3. **考虑**把可能在整个应用中到处引用的模块命名为 SharedModule
4. **考虑**不要在共享模块中提供服务。服务通常是单例的，应该在整个应用或一个特定的特性模块中只有一份。 不过也有例外，比如，在下面的范例代码中，注意 SharedModule 提供了 FilterTextService。这里可以这么做，因为该服务是无状态的，也就是说，该服务的消费者不会受到这些新实例的影响。
5. **坚持**在 SharedModule 中导入所有模块都需要的资产（例如 CommonModule 和 FormsModule）。

## 组件

把组件当成元素

考虑给组件一个元素选择器，而不是属性或类选择器

### 把模板和样式提取到它们自己的文件

1. **坚持**当超过 3 行时，把模板和样式提取到一个单独的文件。
2. **坚持**把模板文件命名为 [component-name].component.html，其中，[component-name] 是组件名。
3. **坚持**把样式文件命名为 [component-name].component.css，其中，[component-name] 是组件名。
4. **坚持**指定相对于模块的 URL，给它加上 ./ 前缀。

### 成员顺序

1. **坚持**把属性成员放在前面，方法成员放在后面
2. **坚持**先放共有成员，再放私有成员，并按照字母顺序排列

### 把逻辑放在服务里

1. **坚持** 在组件中只包含与视图相关的逻辑。所有其它逻辑都应该放到服务中。
2. **坚持** 把可复用的逻辑放在服务中，保持组件简单

### 不要给输出属性加前缀

1. **坚持**命名事件时，不要带前缀 on。
2. **坚持**把事件处理器方法命名为 on 前缀之后紧跟着事件名。
   为何？与内置事件命名一致，例如按钮点击。

### 把表现层逻辑放到组件类里

1. **坚持**把表现层逻辑放进组件类中，而不要放在模板里。（类比React 组件中属性上不要有逻辑）
   为何？逻辑应该只出现在一个地方（组件类里）而不应分散在两个地方。

## 服务

### 服务总是单例的

1. **坚持**在同一个注入器内，把服务当成单例使用。用它们来共享数据和功能

## 数据服务

通过服务与 Web 服务器通讯

- 坚持把数据操作和与数据交互的逻辑重构到服务里。
- 坚持让数据服务来负责 XHR 调用、本地储存、内存储存或者其它数据操作。

为什么?
组件的职责是展示和收集视图信息。它不应该关心如何获取数据，只需知道向谁请求数据即可。将数据服务分离出来，把获取数据的逻辑移到数据服务中，使得组件更简单，并专注于视图。

为何？
在测试使用数据服务的组件时，可以让数据调用更容易被测试（模拟或者真实）。

为什么?
数据管理的细节（例如标头、HTTP 方法、缓存、错误处理和重试逻辑）与组件和其他数据消费者无关。

数据服务应该封装这些细节。这样，在服务内部修改细节，就不会影响到它的消费者。并且更容易通过实现一个模拟服务来对消费者进行测试。

## other

### 单一职责

1. **坚持**创建封装在上下文中的单一职责的服务
2. **坚持**当服务成长到超出单一用途时，创建一个新服务。

### LIFT

- 快速定位 (Locate) 代码
- 一眼识别 (Identify) 代码
- 尽量保持扁平结构 (Flattest)
- 尝试 (Try) 遵循 DRY (Do Not Repeat Yourself, 不重复自己)
  此为 `LIFT` 原则

### 定位

1. **坚持**直观，简单和快速定位代码
   为何？ 想要高效的工作，就必须迅速找到文件，特别是当不知道（或不记得）文件名时。把相关的文件一起放在一个直观的位置可以节省时间。富有描述性的目录结构会让你和后面的维护者眼前一亮

### 识别

1. **坚持**命名文件到这个程度：看到文件名立刻知道它包含了什么，代表什么。
2. **坚持**文件名要具有说明性，确保文件中只包含一个组件
3. **避免**包含多个文件，服务，或者混合体的文件
   > 特殊情况：当你有一组小型，密切相关的特性时，违反 **一物一文件**的规则可能更好。

### 扁平

1. **坚持**尽可能保持扁平的目录结构
2. **考虑**当一个目录下达到7个或者更多文件时创建子目录
   当关注的事物超过 9 个时，人类就会开始感到吃力。 所以，当一个文件夹中的文件有 10 个或更多个文件时，可能就是创建子目录的时候了。
   当有很多文件时（例如 10 个以上），在专用目录型结构中定位它们会比在扁平结构中更容易。
   还是根据你自己的舒适度而定吧。 除非创建新文件夹能有显著的价值，否则尽量使用扁平结构。

### T-DRY(尽量不重复自己)

1. **坚持**DRY（Don't Repeat Yourself,不要重复自己）
2. **避免**过度DRY，以致于牺牲了阅读性
