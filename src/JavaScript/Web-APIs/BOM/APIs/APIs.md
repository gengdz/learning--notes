# APIs

## 一些资料

- [浏览器提供了这些 API](https://mp.weixin.qq.com/s/nJdlLjl6xlB2Z3myOFkJWw)

## new URL、new URLSearchParams

URLSearchParams 是现代浏览器提供的一个内置 API，适用于解析查询字符串。

```typescript
const url = new URL(window.location.href);
const queryParams = new URLSearchParams(url.search);

const page = queryParams.get('page');
const sort = queryParams.get('sort');

console.log(page); // 输出：2
console.log(sort); // 输出：ascending
```

## Server-sent events

服务器向客户端发送消息

```JavaScript

const evtSource = new EventSource("url", {
  withCredentials: true,
});

evtSource.onmessage = function (event) {}

evtSource.onerror = function (err) {}

evtSource.close()
```

发送事件的服务器端脚本需要使用 `text/event-stream` MIME 类型响应内容。每个通知以文本块形式发送，并以一对换行符结尾。

规范中规定了下面这些字段：

| 字段     | 描述                                                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event    | 一个用于标识事件类型的字符串。如果指定了这个字符串，浏览器会将具有指定事件名称的事件分派给相应的监听器；网站源代码应该使用 `addEventListener()` 来监听指定的事件。如果一个消息没有指定事件名称，那么 `onmessage` 处理程序就会被调用。 |
| data     | 消息的数据字段。当 `EventSource` 接收到多个以 `data:` 开头的连续行时，会将它们连接起来，在它们之间插入一个换行符。末尾的换行符会被删除。                                                                                              |
| id       | 事件 ID，会成为当前 `EventSource` 对象的内部属性“最后一个事件 ID”的属性值。                                                                                                                                                           |
| retry    | 重新连接的时间。如果与服务器的连接丢失，浏览器将等待指定的时间，然后尝试重新连接。这必须是一个整数，以毫秒为单位指定重新连接的时间。如果指定了一个非整数值，该字段将被忽略。                                                          |
| 其他字段 | 所有其他的字段名都会被忽略。                                                                                                                                                                                                          |

下面是 WebSocket、轮询和 SSE 的功能对比

| | WebSocket | Server-Sent Events (SSE) | 轮询 (Polling) |
| -------------- | -------------------------------------- | ---------------------------------------------- | ------------------------------------ |
| **连接方式** | 双向通信，持久连接 | 单向通信，服务器推送事件 | 单向请求，服务器响应 |
| **协议** | 基于 TCP 的协议 | 基于 HTTP 的协议 | 基于 HTTP 的协议 |
| **数据格式** | 可以使用文本或二进制数据 | 通常使用文本格式（如 JSON、纯文本） | 通常使用文本格式 |
| **性能** | 高性能，适合高频繁消息通信 | 适中性能，适合不太频繁的数据更新 | 性能较低，尤其在高频率请求时开销很大 |
| **连接开销** | 连接建立后开销较小 | 由于HTTP协议，每次请求都有开销 | 每次请求都需要建立连接，开销较大 |
| **重连机制** | 需要手动实现重连逻辑 | 自动重连机制 | 需要手动实现重试逻辑 |
| **实时性** | 提供低延迟高实时性的通信 | 通常提供较好的实时性，但由于HTTP的限制可能稍慢 | 实时性较差，依赖请求间隔 |
| **适用场景** | 聊天应用、在线游戏等需要双向通信的场景 | 实时更新的应用，如股票行情、新闻推送等 | 是数据更新不是频繁而且容忍延迟的场景 |
| **管理复杂性** | 需要处理连接、消息、错误等多种情况 | 相对简单，仅需处理服务器推送与事件 | 逻辑相对简单，但需要考虑到轮询频率 |
| **消息丢失** | 发送和接收的消息可能会丢失 | 通过 EventSource 可以自动重新发送未接收消息 | 可能错过更新，取决于轮询频率 |

一些封装的库：@microsoft/fetch-event-source

### @microsoft/fetch-event-source 封装了什么

这个软件包提供了一个更好的 API，用于发起事件源请求——也称为服务器推送事件——并集成了 Fetch API 的所有功能。

#### 默认浏览器 EventSource API 的限制

默认的浏览器 EventSource API 施加了几项限制，限制了您可以发起的请求类型：

1. **请求体**：您无法传递请求体，必须将执行请求所需的所有信息编码到 URL 中，而大多数浏览器对 URL 的限制为 2000 个字符。
2. **自定义请求头**：您无法传递自定义请求头。
3. **请求方法**：您只能进行 GET 请求，不能指定其他方法。
4. **重试策略**：如果连接断开，您对重试策略没有控制权，浏览器会默默地为您重试几次，然后停止，这对于任何健壮的应用来说都不够好。

#### 该库的优势

这个库提供了一种替代接口，用于消费服务器推送事件，基于 Fetch API。它的优势包括：

- **灵活的请求**：您可以使用任何请求方法/头/体，以及 fetch() 提供的其他功能。您甚至可以提供一个替代的 fetch() 实现，如果默认的浏览器实现不适合您。
- **访问响应对象**：如果您想在解析事件源之前执行一些自定义验证/处理，您可以访问响应对象。这在您有 API 网关（如 nginx）位于应用服务器前时非常有用：如果网关返回错误，您可以对此进行合理处理。

- **控制重试策略**：如果连接断开或发生错误，您对重试策略有完全的控制权。

#### 页面可见性 API 集成

此外，这个库还与浏览器的页面可见性 API 集成，因此：

- 当文档隐藏（例如，用户最小化窗口）时，连接会关闭。
- 在再次可见时，会使用上一个事件 ID 自动重试。

这一点减少了服务器的不必要负载，但您可以选择不使用此行为。

## DOMParser

作用是：解析 XML 或 HTML 源代码字符串，并返回一个可操作的 Document 对象。该 Document 对象是一个完整的 DOM 树，可以像处理常规 HTML 元素一样处理。

```typescript
export const parseInnerTextFromStr = (str: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const { innerText } = doc.body;
  return innerText;
};
```

## URL Pattern API

匹配模块包含：URL Pattern API 的模式语法包括：

- 字面字符串：将精确匹配的文本字符串，例如 "/home" 或 "/contact"。
- 通配符：如 "/posts/ " 中的星号 ( ) 表示匹配任何字符序列，直至遇到下一个路径分隔符（/）。
- 命名组：如 "/books/:id" 中的 ":id"，它会提取匹配 URL 中对应部分的值，作为单独的数据项。
- 非捕获组：如 "/books{/old}?"，这里的花括号 {...}? 表示该部分模式是可选的，可以匹配 0 次或 1 次，且不会作为一个单独的数据项提取出来。
- 正则表达式组：如 "/books/(\d+)" 中的 (\d+)，这部分遵循 JavaScript 正则表达式的规则，用于进行复杂匹配，尽管在 URL Pattern API 中有一定的限制。例如，此处的正则表达式将匹配一个或多个数字字符，并将其作为一个独立的数据项提取出来。

```typescript
const pattern = new URLPattern({ pathname: '/books/:id' });
console.log(pattern.test('https://example.com/books/123')); // true
console.log(pattern.exec('https://example.com/books/123').pathname.groups); // { id: '123' }
```

## CSS Custom Highlight API

CSS 自定义高亮 API 提供了一种方法，可以通过使用 JavaScript 创建范围并使用 CSS 定义样式来设置文档中任意文本范围的样式。

## Compression Stream API

内置的压缩

## Cookie Store API

作用是：获取 cookie。 异步的方式获取。

- cookieStore.getAll 获取全部
- cookieStore.delete: 删除
- cookieStore.get: 获取单个 cookie 信息
- cookieStore.set: 设置单个 cookie 信息

```typescript
cookieStore.getAll().then(console.log);

获取到的值为如下类型：

{
    "domain": "alibaba-inc.com",
    "expires": 1716029214741.809,
    "name": "SSO_LANG_V2",
    "partitioned": false,
    "path": "/",
    "sameSite": "lax",
    "secure": false,
    "value": "ZH-CN"
}
```

监听 cookie 变化

```bash
cookieStore.addEventListener('change', (event) => {
  const type = event.changed.length ? 'change' : 'delete';
  const data = (event.changed.length ? event.changed : event.deleted).map((item) => item.name);

  console.log(`【${type}】, cookie：${JSON.stringify(data)}`);
});


```

## MutationObserver

Mutation 是突变的意思

MutationObserver 的作用是监听 DOM 变化。可以监听 DOM 节点的新增、删除、属性变化、文本内容变化

```typescript
// 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = {
  childList: true, // 监听目标节点的子节点的增减
  attributes: true, // 监听属性的变化
  characterData: true, // 监听文本节点内容的变化
  subtree: true, // 监听目标节点以及其子孙节点的变动
  attributeOldValue: true, // 记录变化前的属性值
  characterDataOldValue: true, // 记录变化前的数据
  attributeFilter: ['class', 'style'], // 仅监视 class 和 style 变化
};

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
    } else if (mutation.type === 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
  }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察，一般说来这个放在 callback 中，满足某种条件之后就不观察了。
observer.disconnect();
```

## InterSectionObserver

检测一个元素是否与祖先元素或者 viewport 是否相交。viewport 在浏览器中代表网站可见内容的部分。

用法如下：

```typescript
let observer = new IntersectionObserver(callback, {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0,
});

let target = document.querySelector('#listItem');
observer.observe(target);
```

```typescript
interface IntersectionObserverCallback {
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
}
```

> root 元素必须是 目标元素 的祖先级元素，
>
> rootMargin 是 root 元素的外边距。用来扩大 root 范围的。
>
> threshold 是交叉度。指交叉了多少的时候触发 callback。0-1 的取值

实例方法：IntersectionObserver 的 disconnect()方法终止对所有目标元素可见性变化的观察。

IntersectionObserver 的 unobserve() 方法命令 IntersectionObserver 停止对一个元素的观察。

可以用来做

- 判断一个元素和另一个元素是否相交
- 下拉刷新
- 上拉加载

### 封装一个图片懒加载组件的思路，以及优化方案

- 监听事件防抖节流
- 考虑图片的宽高

```typescript
import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, placeholder, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || 'placeholder.png');
  const [imageRef, setImageRef] = useState(null);

  // 使用 IntersectionObserver 监听元素进入可视区域
  const onLoad = (entries, observer) => {
    for (let entry of entries) {
      if (entry.isIntersecting) {
        // 图片进入可视区域，加载图片
        setImageSrc(src);
        observer.unobserve(imageRef);
      }
    }
  };

  useEffect(() => {
    let observer;
    if (imageRef && IntersectionObserver) {
      observer = new IntersectionObserver(onLoad, {
        rootMargin: '0px', // 可根据需要设置预加载距离
        threshold: 0.01 // 当 0.01 部分可见时触发回调
      });
      observer.observe(imageRef);
    }
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]); // 仅当 src 或 DOM 引用发生变化时运行 effect

  return <img src={imageSrc} alt={alt} ref={setImageRef} {...props} />;
};

export default LazyImage;

```

## BroadcastChannel

它允许同源的不同浏览器窗口，Tab 页，frame 或者 iframe 下的不同文档相互通讯。

```typescript
const channel = new BroadcastChannel('channel-name');
channel.postMessage();
channel.onmessage = (event) => {};
```
