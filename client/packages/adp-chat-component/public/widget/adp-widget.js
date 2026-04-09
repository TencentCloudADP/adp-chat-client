import { G as y, t as S, e as _, A as c, g as k3 } from "./adp-widget-vendor.js";
const y3 = {
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-CN": "zh-CN",
  zh_CN: "zh-CN",
  chinese: "zh-CN",
  en: "en-US",
  "en-us": "en-US",
  "en-US": "en-US",
  en_US: "en-US",
  english: "en-US"
};
function _3(e) {
  return e && (y3[e] || y3[e.toLowerCase()]) || null;
}
const u1 = {
  // DatePicker
  "datepicker.placeholder": {
    "zh-CN": "请选择日期",
    "en-US": "Select date"
  },
  "datepicker.clearLabel": {
    "zh-CN": "清除当前值",
    "en-US": "Clear current value"
  },
  // ListView
  "listview.expand": {
    "zh-CN": "展开 {count} 项",
    "en-US": "Show {count} more"
  },
  "listview.collapse": {
    "zh-CN": "收起",
    "en-US": "Show less"
  },
  // Select
  "select.placeholder": {
    "zh-CN": "请选择",
    "en-US": "Please select"
  },
  "select.clearLabel": {
    "zh-CN": "清除当前值",
    "en-US": "Clear current value"
  },
  "select.noResults": {
    "zh-CN": "无匹配结果",
    "en-US": "No results found."
  },
  "select.setupError": {
    "zh-CN": "设置隐藏select失败",
    "en-US": "Failed to setup hidden select"
  },
  "select.updateError": {
    "zh-CN": "更新隐藏select失败",
    "en-US": "Failed to update hidden select"
  },
  // Form
  "form.invalidEmail": {
    "zh-CN": "请输入有效的邮箱地址",
    "en-US": "Please enter a valid email address"
  },
  "form.invalidFormat": {
    "zh-CN": "输入格式不正确",
    "en-US": "Invalid format"
  },
  "form.required": {
    "zh-CN": "请填写此字段",
    "en-US": "Please fill in this field"
  },
  "form.checkRequired": {
    "zh-CN": "请勾选此字段",
    "en-US": "Please check this field"
  },
  "form.selectRequired": {
    "zh-CN": "请选择一个选项",
    "en-US": "Please select an option"
  },
  // Widget errors
  "widget.invalidConfig": {
    "zh-CN": "不合法的 Widget 配置",
    "en-US": "Invalid widget configuration"
  },
  "widget.noConfig": {
    "zh-CN": "暂无配置",
    "en-US": "No configuration"
  },
  "widget.invalidWidget": {
    "zh-CN": "不合法widget",
    "en-US": "Invalid widget"
  },
  "widget.renderFailed": {
    "zh-CN": "渲染失败",
    "en-US": "Render failed"
  },
  "widget.markdownLoadFailed": {
    "zh-CN": "⚠️ Markdown 组件加载失败",
    "en-US": "⚠️ Markdown component failed to load"
  },
  "widget.plainTextFallback": {
    "zh-CN": "以下是纯文本内容：",
    "en-US": "Plain text content:"
  },
  "widget.chartLoadFailed": {
    "zh-CN": "⚠️ Chart 组件加载失败",
    "en-US": "⚠️ Chart component failed to load"
  },
  "widget.chartType": {
    "zh-CN": "图表类型: {type}",
    "en-US": "Chart type: {type}"
  },
  // Markdown
  "markdown.copied": {
    "zh-CN": "代码已复制到剪贴板",
    "en-US": "Code copied to clipboard"
  },
  "markdown.copyFailed": {
    "zh-CN": "复制失败",
    "en-US": "Copy failed"
  },
  // Validation
  "validation.invalidJson": {
    "zh-CN": "不合法的 JSON 格式",
    "en-US": "Invalid JSON format"
  },
  // ImageSelect
  "imageselect.uploadText": {
    "zh-CN": "点击上传",
    "en-US": "Click to upload"
  },
  "imageselect.invalidFile": {
    "zh-CN": "请选择有效的图片文件",
    "en-US": "Please select a valid image file"
  },
  "imageselect.invalidFileType": {
    "zh-CN": "请选择有效的图片文件",
    "en-US": "Please select a valid image file"
  },
  "imageselect.invalidDefaultValue": {
    "zh-CN": "无效的默认图片数据",
    "en-US": "Invalid default image data"
  },
  "imageselect.fileSizeExceeded": {
    "zh-CN": "文件大小不能超过 {maxSize}MB",
    "en-US": "File size cannot exceed {maxSize}MB"
  },
  "imageselect.fileSizeExceedsLimit": {
    "zh-CN": "文件大小不能超过 {maxSize}MB",
    "en-US": "File size cannot exceed {maxSize}MB"
  },
  "imageselect.fileSizeExceededHardLimit": {
    "zh-CN": "文件大小不能超过 20MB",
    "en-US": "File size cannot exceed 20MB"
  },
  "imageselect.fileSizeExceedsHardLimit": {
    "zh-CN": "文件大小不能超过 20MB",
    "en-US": "File size cannot exceed 20MB"
  },
  "imageselect.readFileFailed": {
    "zh-CN": "读取文件失败，请重试",
    "en-US": "Failed to read file, please try again"
  },
  "imageselect.fileReadFailed": {
    "zh-CN": "读取文件失败，请重试",
    "en-US": "Failed to read file, please try again"
  },
  "imageselect.imageLoadFailed": {
    "zh-CN": "图片加载失败",
    "en-US": "Image failed to load"
  },
  "imageselect.previewAlt": {
    "zh-CN": "预览图片",
    "en-US": "Preview image"
  }
};
let N = "zh-CN";
const F = [];
function L3(e) {
  N !== e && (N = e, localStorage.setItem("omi-widget-locale", e), F.forEach((t) => t(e)));
}
function T() {
  return N;
}
function z3(e) {
  return F.push(e), () => {
    const t = F.indexOf(e);
    t > -1 && F.splice(t, 1);
  };
}
function b(e, t) {
  const i = u1[e];
  if (!i)
    return console.warn(`[i18n] Translation key not found: ${e}`), e;
  let o = i[N] || i["zh-CN"] || e;
  return t && Object.keys(t).forEach((r) => {
    o = o.replace(`{${r}}`, String(t[r]));
  }), o;
}
const p1 = [
  "prose",
  "primary",
  "emphasis",
  "secondary",
  "tertiary",
  "success",
  "warning",
  "danger",
  "info"
];
function A3(e) {
  return typeof e == "string" && p1.includes(e);
}
function V3(e) {
  return /^[a-z]+-\d{3}$/.test(e);
}
function h1(e) {
  return typeof e == "object" && e !== null && "light" in e && "dark" in e;
}
function S3(e) {
  return V3(e) ? `var(--color-${e})` : A3(e) ? `var(--color-text-${e})` : e;
}
function B(e) {
  if (h1(e)) {
    const t = S3(e.light), i = S3(e.dark);
    return {
      style: `color: ${t}; color: light-dark(${t}, ${i});`
    };
  }
  return A3(e) ? { dataColor: e } : typeof e == "string" && V3(e) ? {
    style: `color: var(--color-${e});`
  } : typeof e == "string" ? {
    style: `color: ${e};`
  } : {};
}
function C1(e) {
  return typeof e == "number" ? `${e}px` : e;
}
function V(e, t = 4) {
  return typeof e == "number" ? `${e * t}px` : e;
}
function j(e) {
  if (typeof e == "number")
    return `${e * 4}px`;
  if (typeof e == "string")
    return e;
  if (typeof e == "object") {
    const t = e.top !== void 0 ? e.top : e.y !== void 0 ? e.y : 0, i = e.right !== void 0 ? e.right : e.x !== void 0 ? e.x : 0, o = e.bottom !== void 0 ? e.bottom : e.y !== void 0 ? e.y : 0, r = e.left !== void 0 ? e.left : e.x !== void 0 ? e.x : 0, n = `${t * 4}px`, a = `${i * 4}px`, d = `${o * 4}px`, s = `${r * 4}px`;
    return `${n} ${a} ${d} ${s}`;
  }
  return "0";
}
function f1(e) {
  if (typeof e == "number")
    return `${e * 4}px`;
  if (typeof e == "string") {
    const t = e.trim().split(/\s+/);
    return t.length === 1 ? t[0] : t.length === 2 || t.length === 4 ? t[1] : t[0];
  }
  return typeof e == "object" ? `${(e.right !== void 0 ? e.right : e.x !== void 0 ? e.x : 0) * 4}px` : null;
}
function $3(e) {
  if (typeof e == "number")
    return `${e}px solid var(--color-border)`;
  if (typeof e == "string") {
    const n = parseFloat(e);
    return !isNaN(n) && e.trim() === String(n) ? `${n}px solid var(--color-border)` : "1px solid var(--color-border)";
  }
  if (typeof e != "object" || e === null)
    return "1px solid var(--color-border)";
  if (!("top" in e || "right" in e || "bottom" in e || "left" in e || "x" in e || "y" in e) && ("size" in e || "color" in e || "style" in e)) {
    const n = e.size || 1, a = e.color || "var(--color-border)", d = C3(a), s = e.style || "solid";
    return `${n}px ${s} ${d}`;
  }
  const i = e, o = {}, r = (n) => {
    if (typeof n == "number")
      return `${n}px solid var(--color-border)`;
    const a = n.size || 1, d = n.color || "var(--color-border)", s = C3(d), l = n.style || "solid";
    return `${a}px ${l} ${s}`;
  };
  return i.x !== void 0 && (o["border-left"] = r(i.x), o["border-right"] = r(i.x)), i.y !== void 0 && (o["border-top"] = r(i.y), o["border-bottom"] = r(i.y)), i.top !== void 0 && (o["border-top"] = r(i.top)), i.right !== void 0 && (o["border-right"] = r(i.right)), i.bottom !== void 0 && (o["border-bottom"] = r(i.bottom)), i.left !== void 0 && (o["border-left"] = r(i.left)), o;
}
function Z3(e) {
  return {
    "2xs": "0.125rem",
    // 2px
    xs: "0.25rem",
    // 4px
    sm: "0.375rem",
    // 6px
    md: "0.5rem",
    // 8px
    lg: "0.75rem",
    // 12px
    xl: "1rem",
    // 16px
    "2xl": "1.5rem",
    // 24px
    "3xl": "2rem",
    // 32px
    full: "9999px"
  }[e] || e;
}
function C3(e, t = "light") {
  if (!e) return "var(--color-prose)";
  if (typeof e == "object" && "light" in e && "dark" in e)
    return e[t];
  if (typeof e != "string")
    return "var(--color-prose)";
  if (e === "currentColor") return "currentColor";
  const i = {
    prose: "var(--color-prose)",
    primary: "var(--color-primary)",
    emphasis: "var(--color-emphasis)",
    secondary: "var(--color-secondary)",
    tertiary: "var(--color-tertiary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
    info: "var(--color-info)",
    discovery: "var(--color-discovery)",
    caution: "var(--color-caution)",
    default: "currentColor"
  }, o = {
    subtle: "var(--color-border-subtle)",
    default: "var(--color-border)",
    strong: "var(--color-border-strong)"
  };
  if (i[e])
    return i[e];
  if (o[e])
    return o[e];
  const r = /^alpha-(\d+)$/, n = e.match(r);
  return n ? `color-mix(in srgb, currentColor ${parseInt(n[1], 10) / 100 * 100}%, transparent)` : /^(gray|red|orange|yellow|green|blue|purple|pink|teal|indigo)-(50|100|200|300|400|500|600|700|800|900)$/.test(e) ? `var(--color-${e})` : /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+).*$/i.test(e) ? e : (console.warn(`[parseColor] 无法识别的颜色值 "${e}"，使用默认颜色 prose`), "var(--color-prose)");
}
function R3(e, t = "light") {
  if (!e) return "transparent";
  if (typeof e == "object" && "light" in e && "dark" in e)
    return e[t];
  if (typeof e != "string")
    return "transparent";
  const i = {
    surface: "var(--color-surface)",
    "surface-secondary": "var(--color-surface-secondary)",
    "surface-tertiary": "var(--color-surface-tertiary)",
    "surface-elevated": "var(--color-surface-elevated)",
    "surface-elevated-secondary": "var(--color-surface-elevated-secondary)"
  };
  return i[e] ? i[e] : /^(gray|red|orange|yellow|green|blue|purple|pink|teal|indigo)-(50|100|200|300|400|500|600|700|800|900)$/.test(e) ? `var(--color-${e})` : /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+).*$/i.test(e) ? e : (console.warn(
    `[parseBackground] 无法识别的背景颜色值 "${e}"，使用透明背景`
  ), "transparent");
}
function D3(e, t = 1) {
  const i = {};
  return e.width && (i.width = V(e.width, t)), e.height && (i.height = V(e.height, t)), e.size && (i.width = V(e.size, t), i.height = V(e.size, t)), e.minWidth && (i["min-width"] = V(e.minWidth, t)), e.minHeight && (i["min-height"] = V(e.minHeight, t)), e.minSize && (i["min-width"] = V(e.minSize, t), i["min-height"] = V(e.minSize, t)), e.maxWidth && (i["max-width"] = V(e.maxWidth, t)), e.maxHeight && (i["max-height"] = V(e.maxHeight, t)), e.maxSize && (i["max-width"] = V(e.maxSize, t), i["max-height"] = V(e.maxSize, t)), e.aspectRatio && (i["aspect-ratio"] = String(e.aspectRatio)), e.radius && (i["border-radius"] = Z3(e.radius)), e.margin && (i.margin = j(e.margin)), i;
}
function g1(e) {
  const t = {};
  if (e.padding) {
    const i = j(e.padding);
    t.padding = i;
    const o = f1(e.padding);
    o && (t["--container-padding-x"] = o);
  }
  if (e.border) {
    const i = $3(e.border);
    typeof i == "string" ? t.border = i : Object.assign(t, i);
  }
  return e.background && (t.background = R3(e.background, e.theme)), e.flex !== void 0 && (typeof e.flex == "number" ? t.flex = `${e.flex} 0 0%` : t.flex = e.flex), t;
}
function T3(e) {
  const t = {
    display: "flex"
  }, i = e.direction || "col";
  t.flexDirection = i === "col" ? "column" : "row";
  const r = i === "row" && !e.align ? "center" : void 0, n = e.align || r;
  if (n) {
    const a = {
      start: "flex-start",
      center: "center",
      end: "flex-end"
    };
    t.alignItems = a[n] || n;
  }
  if (e.justify) {
    const a = {
      start: "flex-start",
      end: "flex-end",
      center: "center",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly"
    };
    t.justifyContent = a[e.justify] || e.justify;
  }
  if (e.wrap && (t.flexWrap = e.wrap), e.gap !== void 0) {
    const a = e.gap;
    t.gap = typeof a == "number" ? `${a * 4}px` : a;
  }
  return t;
}
function I(...e) {
  return Object.assign({}, ...e.filter(Boolean));
}
function M3(e, t) {
  if (!e.includes("."))
    return { [e]: t };
  const i = e.split(".");
  let o = {}, r = o;
  for (let n = 0; n < i.length; n++) {
    const a = i[n];
    n === i.length - 1 ? r[a] = t : (r[a] = {}, r = r[a]);
  }
  return o;
}
function E(e) {
  const t = {}, i = (r, n, a) => {
    const d = n.split(".");
    let s = r;
    for (let l = 0; l < d.length - 1; l++) {
      const u = d[l];
      (!(u in s) || typeof s[u] != "object") && (s[u] = {}), s = s[u];
    }
    s[d[d.length - 1]] = a;
  }, o = (r) => {
    if (r.tagName.toLowerCase() === "slot" && r instanceof HTMLSlotElement) {
      r.assignedElements().forEach((l) => o(l));
      return;
    }
    let a = r.getAttribute("name"), d = !1;
    if (!a && r.shadowRoot) {
      const s = r.shadowRoot.querySelector(
        "input, textarea, select"
      );
      if (s) {
        const l = s.getAttribute("name");
        l && (a = l, d = !0);
      }
    }
    if (!a && "name" in r && (a = r.name), a) {
      let s;
      if (r instanceof HTMLInputElement)
        if (r.type === "checkbox")
          s = r.checked;
        else if (r.type === "radio")
          if (r.checked)
            s = r.value;
          else
            return;
        else
          s = r.value || "";
      else if (r instanceof HTMLTextAreaElement)
        s = r.value || "";
      else if (r instanceof HTMLSelectElement)
        s = r.value || "";
      else {
        const l = P(r);
        r.tagName.toLowerCase() === "checkbox-widget" ? s = l !== void 0 ? l : !1 : s = l != null && l !== "" ? l : "";
      }
      if (i(t, a, s), d) {
        Array.from(r.children).forEach((l) => o(l));
        return;
      }
    }
    Array.from(r.children).forEach((s) => o(s)), r.shadowRoot && Array.from(r.shadowRoot.children).forEach(
      (s) => o(s)
    );
  };
  return o(e), t;
}
function P(e) {
  const t = e.tagName.toLowerCase();
  if (t === "image-select-widget")
    return e.value || "";
  if (e.shadowRoot) {
    const i = e.shadowRoot.querySelector("input, textarea, select");
    if (i instanceof HTMLInputElement)
      return i.type === "checkbox" ? i.checked : i.value;
    if (i instanceof HTMLTextAreaElement || i instanceof HTMLSelectElement)
      return i.value;
  }
  if ("value" in e) {
    const i = e.value;
    if (i != null)
      return i;
  }
  if (t === "select-widget" || t === "input-widget")
    return e.value || "";
}
function m1(e) {
  const t = e.parentElement?.closest(
    "form-widget"
  );
  if (t && t.shadowRoot) {
    const o = t.shadowRoot.querySelector("form");
    if (o) return o;
  }
  let i = e;
  for (; i; ) {
    const o = i.parentElement?.closest(
      "card-widget"
    );
    if (o && o.shadowRoot) {
      let r = o.shadowRoot.querySelector(
        "form"
      );
      if (r) return r;
      const n = o.shadowRoot.querySelector(
        "form-widget"
      );
      if (n && n.shadowRoot && (r = n.shadowRoot.querySelector(
        "form"
      ), r))
        return r;
    }
    if (o) break;
    i = i.parentElement;
  }
  return e.closest("form");
}
function v1(e, t) {
  const i = E(e);
  let o;
  return t && (o = {
    ...t,
    payload: {
      ...t.payload,
      // 保留原有的 payload
      ...i
      // 合并表单数据
    }
  }), { formData: i, actionWithPayload: o };
}
function P3(e, t) {
  return (i) => {
    t({
      type: e.type,
      payload: {
        ...e.payload,
        // 保留原有的 payload
        ...i
        // 合并表单数据
      }
    });
  };
}
function b1(e) {
  if (e.trim() === "")
    return !0;
  try {
    return JSON.parse(e), !0;
  } catch (t) {
    return console.warn("[isValidJSON] JSON 解析失败:", t), !1;
  }
}
function x1(e) {
  return b1(e) ? { valid: !0 } : {
    valid: !1,
    error: b("validation.invalidJson")
  };
}
const B3 = ":host{display:inline-block;width:fit-content;position:relative}:host([data-block]){display:block;width:100%;min-width:0}.select-widget{display:block;width:100%;position:relative;min-width:0}.select-widget[data-block]{display:block;width:100%}.select-widget .dropdown-menu{position:absolute;top:100%;left:0;right:0;z-index:1000;max-height:min(var(--select-list-max-height, 400px),var(--radix-popover-content-available-height));overflow-y:auto}._Option_pdvhu_70:hover:before{opacity:1}", w1 = ":host{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:inherit}:host svg{display:block;width:100%;height:100%}", y1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.8333 18.3334C30.8333 11.4298 25.2369 5.83337 18.3333 5.83337C11.4298 5.83337 5.83331 11.4298 5.83331 18.3334C5.83331 25.2369 11.4298 30.8334 18.3333 30.8334C25.2369 30.8334 30.8333 25.2369 30.8333 18.3334ZM28.0193 29.7872C25.406 31.9994 22.0254 33.3334 18.3333 33.3334C10.049 33.3334 3.33331 26.6176 3.33331 18.3334C3.33331 10.0491 10.049 3.33337 18.3333 3.33337C26.6176 3.33337 33.3333 10.0491 33.3333 18.3334C33.3333 22.0255 31.9993 25.4061 29.7871 28.0195L36.0109 34.2433C36.2854 34.5178 36.4227 34.6551 36.4862 34.8083C36.5707 35.0125 36.5707 35.2419 36.4862 35.4461C36.4227 35.5992 36.2854 35.7365 36.0109 36.011C35.7363 36.2856 35.599 36.4229 35.4459 36.4863C35.2417 36.5709 35.0123 36.5709 34.8081 36.4863C34.655 36.4229 34.5177 36.2856 34.2431 36.011L28.0193 29.7872Z" fill="currentColor"/>
</svg>
`, _1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M35.2561 8.64463C35.1745 8.50055 35.0216 8.38111 34.7159 8.14223C34.4105 7.90363 34.2578 7.78432 34.0984 7.74C33.885 7.68067 33.6569 7.70868 33.4642 7.81785C33.3203 7.89942 33.201 8.05212 32.9624 8.35752L18.1652 27.2964L8.71674 16.8049L8.71673 16.8049C8.45834 16.518 8.32914 16.3745 8.18052 16.3032C7.98014 16.2071 7.74967 16.1951 7.54035 16.2697C7.38509 16.3251 7.24162 16.4542 6.95467 16.7126L6.95467 16.7126C6.66708 16.9716 6.52329 17.101 6.45199 17.2499C6.35585 17.4507 6.34402 17.6816 6.41915 17.8911C6.47487 18.0465 6.60469 18.19 6.86432 18.477L16.5484 29.1807C16.6121 29.2511 16.6716 29.3169 16.7274 29.3782C17.249 29.9736 17.5168 30.2736 17.8294 30.3787C18.11 30.4729 18.415 30.4646 18.69 30.3551C19.0035 30.2302 19.2589 29.9041 19.7698 29.2519L34.9302 9.89697C35.1695 9.59152 35.2891 9.43879 35.3336 9.27931C35.3932 9.06586 35.3653 8.83747 35.2561 8.64463Z" fill="currentColor"/>
</svg>
`, L1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.1666 20C34.1666 27.8241 27.824 34.1667 20 34.1667C12.1759 34.1667 5.83331 27.8241 5.83331 20C5.83331 12.176 12.1759 5.83337 20 5.83337C27.824 5.83337 34.1666 12.176 34.1666 20ZM36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20ZM27.7602 15.4019C27.6786 15.2582 27.5261 15.139 27.2211 14.9007C26.9156 14.662 26.7628 14.5426 26.6034 14.4983C26.3895 14.4388 26.1607 14.4671 25.9678 14.577C25.824 14.6588 25.705 14.8118 25.4669 15.1178L18.9958 23.4333L15.1456 19.1587L15.1456 19.1587C14.888 18.8727 14.7591 18.7296 14.611 18.6584C14.4102 18.5619 14.179 18.5498 13.9692 18.6248C13.8145 18.6802 13.6714 18.809 13.3853 19.0666L13.3853 19.0666C13.098 19.3253 12.9544 19.4546 12.8831 19.6032C12.7864 19.8048 12.7748 20.0367 12.8508 20.2469C12.9068 20.4019 13.0368 20.545 13.2967 20.8311L18.0909 26.1091C18.4696 26.526 18.6589 26.7345 18.8766 26.8017C19.0676 26.8607 19.2733 26.8491 19.4564 26.769C19.6652 26.6777 19.8299 26.4493 20.1593 25.9925L20.4439 25.5978C20.5049 25.5217 20.5751 25.4319 20.6589 25.3247L27.4361 16.6536L27.4361 16.6536C27.6745 16.3486 27.7937 16.1961 27.8381 16.0369C27.8977 15.8233 27.8696 15.5948 27.7602 15.4019Z" fill="currentColor"/>
</svg>
`, S1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20ZM27.2211 14.9007C27.5261 15.139 27.6786 15.2582 27.7602 15.4019C27.8696 15.5948 27.8977 15.8233 27.8381 16.0369C27.7937 16.1961 27.6745 16.3486 27.4361 16.6536L27.4361 16.6536L20.6589 25.3247C20.5751 25.4319 20.5049 25.5217 20.444 25.5978L20.1593 25.9925L20.1593 25.9925C19.8299 26.4493 19.6652 26.6777 19.4564 26.769C19.2733 26.8491 19.0676 26.8607 18.8766 26.8017C18.6589 26.7345 18.4696 26.526 18.0909 26.1091L13.2967 20.8311L13.2967 20.8311C13.0368 20.545 12.9068 20.4019 12.8508 20.2469C12.7748 20.0367 12.7864 19.8048 12.8831 19.6032C12.9544 19.4546 13.098 19.3253 13.3853 19.0666L13.3853 19.0666C13.6714 18.809 13.8145 18.6802 13.9692 18.6248C14.179 18.5498 14.4102 18.5619 14.611 18.6584C14.7591 18.7296 14.888 18.8727 15.1456 19.1587L18.9958 23.4333L25.4669 15.1178L25.4669 15.1178C25.705 14.8118 25.824 14.6588 25.9678 14.577C26.1607 14.4671 26.3895 14.4388 26.6034 14.4983C26.7628 14.5426 26.9156 14.662 27.2211 14.9007Z" fill="currentColor"/>
</svg>
`, M1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4358 20.3759C10.4255 20.357 10.4164 20.3381 10.4085 20.319C10.3239 20.1148 10.3239 19.8853 10.4085 19.6811C10.4719 19.528 10.6092 19.3907 10.8837 19.1162L25.6151 4.38477C25.8897 4.11022 26.027 3.97294 26.1801 3.9095C26.3843 3.82492 26.6137 3.82492 26.8179 3.9095C26.9711 3.97294 27.1083 4.11022 27.3829 4.38477C27.6575 4.65933 27.7947 4.79661 27.8582 4.94976C27.9427 5.15395 27.9427 5.38337 27.8582 5.58756C27.7947 5.7407 27.6575 5.87798 27.3829 6.15254L13.5354 20.0001L27.3829 33.8476C27.6575 34.1222 27.7948 34.2595 27.8582 34.4126C27.9428 34.6168 27.9428 34.8462 27.8582 35.0504C27.7948 35.2035 27.6575 35.3408 27.3829 35.6154C27.1084 35.8899 26.9711 36.0272 26.818 36.0907C26.6138 36.1752 26.3843 36.1752 26.1801 36.0907C26.027 36.0272 25.8897 35.8899 25.6152 35.6154L10.8838 20.884C10.7445 20.7447 10.6405 20.6407 10.5636 20.5521C10.5079 20.4879 10.4663 20.4317 10.4358 20.3759Z" fill="currentColor"/>
</svg>
`, H1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.5642 19.624C29.5745 19.6429 29.5836 19.6618 29.5915 19.681C29.6761 19.8852 29.6761 20.1146 29.5915 20.3188C29.5281 20.4719 29.3908 20.6092 29.1163 20.8838L14.3849 35.6151C14.1103 35.8897 13.973 36.027 13.8199 36.0904C13.6157 36.175 13.3863 36.175 13.1821 36.0904C13.0289 36.027 12.8917 35.8897 12.6171 35.6151C12.3426 35.3406 12.2053 35.2033 12.1418 35.0502C12.0573 34.846 12.0573 34.6165 12.1418 34.4124C12.2053 34.2592 12.3426 34.1219 12.6171 33.8474L26.4646 19.9999L12.6171 6.1523C12.3425 5.87774 12.2052 5.74046 12.1418 5.58732C12.0572 5.38313 12.0572 5.1537 12.1418 4.94951C12.2052 4.79637 12.3425 4.65909 12.6171 4.38453C12.8916 4.10997 13.0289 3.97269 13.1821 3.90926C13.3862 3.82468 13.6157 3.82468 13.8199 3.90926C13.973 3.97269 14.1103 4.10997 14.3848 4.38453L29.1162 19.1159C29.2555 19.2552 29.3595 19.3592 29.4364 19.4478C29.4921 19.5121 29.5337 19.5682 29.5642 19.624Z" fill="currentColor"/>
</svg>
`, k1 = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', z1 = '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', A1 = `<svg width="100%" height="100%" viewBox="0 0 10 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.34151 0.747423C4.71854 0.417526 5.28149 0.417526 5.65852 0.747423L9.65852 4.24742C10.0742 4.61111 10.1163 5.24287 9.75259 5.6585C9.38891 6.07414 8.75715 6.11626 8.34151 5.75258L5.00001 2.82877L1.65852 5.75258C1.24288 6.11626 0.61112 6.07414 0.247438 5.6585C-0.116244 5.24287 -0.0741267 4.61111 0.34151 4.24742L4.34151 0.747423ZM0.246065 10.3578C0.608879 9.94139 1.24055 9.89795 1.65695 10.2608L5.00001 13.1737L8.34308 10.2608C8.75948 9.89795 9.39115 9.94139 9.75396 10.3578C10.1168 10.7742 10.0733 11.4058 9.65695 11.7687L5.65695 15.2539C5.28043 15.582 4.7196 15.582 4.34308 15.2539L0.343082 11.7687C-0.0733128 11.4058 -0.116749 10.7742 0.246065 10.3578Z"></path></svg>
`, V1 = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.636 5.636a1 1 0 0 1 1.414 0l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"></path></svg>
`, $1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.2045 3.33337C20.5487 3.33337 20.6879 3.37205 20.8237 3.44468C20.9595 3.51731 21.0661 3.62389 21.1387 3.75969C21.2114 3.89549 21.25 4.03475 21.25 4.37888V18.75H35.6212C35.9653 18.75 36.1046 18.7887 36.2404 18.8613C36.3762 18.934 36.4828 19.0406 36.5554 19.1764C36.6135 19.285 36.6499 19.3959 36.6621 19.612L36.6667 20.2045C36.6667 20.5487 36.628 20.6879 36.5554 20.8237C36.4828 20.9595 36.3762 21.0661 36.2404 21.1387C36.1046 21.2114 35.9653 21.25 35.6212 21.25H21.2484L21.25 35.6212C21.25 35.9653 21.2114 36.1046 21.1387 36.2404C21.0661 36.3762 20.9595 36.4828 20.8237 36.5554C20.7151 36.6135 20.6042 36.6499 20.388 36.6621L19.7955 36.6667C19.4514 36.6667 19.3122 36.628 19.1764 36.5554C19.0406 36.4828 18.934 36.3762 18.8613 36.2404C18.7887 36.1046 18.75 35.9653 18.75 35.6212L18.7484 21.25H4.37888C4.03475 21.25 3.89549 21.2114 3.75969 21.1387C3.62389 21.0661 3.51731 20.9595 3.44468 20.8237C3.37205 20.6879 3.33337 20.5487 3.33337 20.2045V19.7955C3.33337 19.4514 3.37205 19.3122 3.44468 19.1764C3.51731 19.0406 3.62389 18.934 3.75969 18.8613C3.89549 18.7887 4.03475 18.75 4.37888 18.75H18.75V4.37888C18.75 4.03475 18.7887 3.89549 18.8613 3.75969C18.934 3.62389 19.0406 3.51731 19.1764 3.44468C19.3122 3.37205 19.4514 3.33337 19.7955 3.33337H20.2045Z" fill="currentColor"/>
</svg>
`, Z1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.2065 3.9089C19.7051 3.6552 20.295 3.6552 20.7936 3.9089C21.2511 4.14166 21.4731 4.55029 21.5646 4.72498C21.6694 4.92501 21.7751 5.17931 21.8766 5.42342L25.2694 13.5807L34.0758 14.2867C34.3393 14.3078 34.6139 14.3297 34.8365 14.3676C35.0309 14.4006 35.4881 14.4855 35.8509 14.8487C36.2462 15.2445 36.4285 15.8055 36.3413 16.3581C36.2613 16.8651 35.9413 17.2025 35.8035 17.3435C35.6456 17.505 35.4364 17.6841 35.2356 17.8561L28.526 23.6036L30.5759 32.1972C30.6373 32.4543 30.7012 32.7222 30.734 32.9456C30.7627 33.1407 30.8233 33.6018 30.59 34.059C30.3357 34.5573 29.8585 34.9041 29.3059 34.9919C28.799 35.0725 28.3792 34.8724 28.2025 34.7849C28.0002 34.6846 27.7652 34.5411 27.5397 34.4032L20 29.798L12.4604 34.4032C12.2349 34.5411 11.9999 34.6846 11.7975 34.7849C11.6208 34.8724 11.201 35.0725 10.6941 34.9919C10.1416 34.9041 9.66438 34.5573 9.4101 34.059C9.17681 33.6018 9.23741 33.1407 9.26604 32.9456C9.29882 32.7222 9.36278 32.4543 9.42417 32.1972L11.4741 23.6036L4.79666 17.8837C4.78596 17.8745 4.77523 17.8653 4.76447 17.8561C4.56367 17.6842 4.35448 17.505 4.19662 17.3435C4.05877 17.2025 3.73874 16.8651 3.65874 16.3581C3.57154 15.8055 3.75382 15.2445 4.14919 14.8487C4.51193 14.4855 4.96916 14.4006 5.16357 14.3676C5.3862 14.3297 5.66073 14.3078 5.92425 14.2867C5.93836 14.2856 5.95244 14.2844 5.96648 14.2833L14.7307 13.5807L18.1072 5.46255C18.1126 5.44954 18.1181 5.4365 18.1235 5.42342C18.225 5.17931 18.3307 4.92501 18.4355 4.72498C18.527 4.5503 18.749 4.14166 19.2065 3.9089ZM20 7.4216L16.9334 14.7946C16.9303 14.802 16.9266 14.8115 16.9221 14.8227C16.8776 14.9338 16.7636 15.2182 16.5593 15.4498C16.3893 15.6424 16.1789 15.7952 15.9432 15.8974C15.6599 16.0202 15.3541 16.0406 15.2347 16.0486C15.2227 16.0494 15.2125 16.0501 15.2045 16.0507L7.24473 16.6889L13.3092 21.8837C13.3153 21.889 13.3232 21.8955 13.3324 21.9032C13.4243 21.9799 13.6597 22.1762 13.8167 22.442C13.9474 22.6633 14.0277 22.9105 14.052 23.1663C14.0813 23.4737 14.0062 23.7708 13.9769 23.8869C13.974 23.8986 13.9715 23.9084 13.9696 23.9163L12.1168 31.6836L18.9315 27.5213C18.9383 27.5171 18.947 27.5116 18.9572 27.5052C19.0585 27.4415 19.3179 27.2783 19.6193 27.2111C19.87 27.1552 20.13 27.1552 20.3808 27.2111C20.6822 27.2783 20.9416 27.4415 21.0429 27.5052C21.0531 27.5116 21.0617 27.5171 21.0686 27.5213L27.8832 31.6836L26.0304 23.9163C26.0286 23.9084 26.0261 23.8986 26.0231 23.8869C25.9938 23.7708 25.9188 23.4737 25.948 23.1663C25.9724 22.9105 26.0527 22.6633 26.1834 22.442C26.3404 22.1761 26.5757 21.9799 26.6676 21.9032C26.6769 21.8955 26.6847 21.889 26.6909 21.8837L32.7553 16.6889L24.7956 16.0507C24.7876 16.0501 24.7774 16.0494 24.7654 16.0486C24.646 16.0406 24.3402 16.0202 24.0569 15.8974C23.8211 15.7952 23.6108 15.6424 23.4408 15.4498C23.2364 15.2182 23.1225 14.9338 23.078 14.8227C23.0735 14.8115 23.0697 14.802 23.0666 14.7946L20 7.4216Z" fill="currentColor"/>
</svg>
`, R1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.2065 3.9089C19.7051 3.6552 20.295 3.6552 20.7936 3.9089C21.2511 4.14166 21.4731 4.55029 21.5646 4.72498C21.6694 4.925 21.7751 5.17928 21.8766 5.42338L21.8766 5.42342L25.2694 13.5807L34.0758 14.2867L34.0758 14.2867C34.3394 14.3078 34.6139 14.3297 34.8365 14.3676C35.0309 14.4006 35.4881 14.4855 35.8509 14.8487C36.2462 15.2445 36.4285 15.8055 36.3413 16.3581C36.2613 16.8651 35.9413 17.2025 35.8035 17.3435C35.6456 17.505 35.4365 17.6841 35.2357 17.856L35.2356 17.8561L28.526 23.6036L30.5759 32.1972C30.6373 32.4543 30.7012 32.7222 30.734 32.9456C30.7627 33.1407 30.8233 33.6018 30.59 34.059C30.3357 34.5573 29.8585 34.9041 29.3059 34.9919C28.799 35.0725 28.3792 34.8724 28.2025 34.7849C28.0002 34.6846 27.7652 34.5411 27.5397 34.4033L27.5397 34.4032L20 29.798L12.4604 34.4032C12.2349 34.5411 11.9999 34.6846 11.7975 34.7849C11.6208 34.8724 11.201 35.0725 10.6941 34.9919C10.1416 34.9041 9.66438 34.5573 9.4101 34.059C9.17681 33.6018 9.23741 33.1407 9.26604 32.9456C9.29882 32.7222 9.36278 32.4543 9.42417 32.1972L11.4741 23.6036L4.79666 17.8837L4.76447 17.8561C4.56367 17.6842 4.35448 17.505 4.19662 17.3435C4.05877 17.2025 3.73874 16.8651 3.65874 16.3581C3.57154 15.8055 3.75382 15.2445 4.14919 14.8487C4.51193 14.4855 4.96916 14.4006 5.16357 14.3676C5.3862 14.3297 5.66073 14.3078 5.92425 14.2867L5.96648 14.2833L14.7307 13.5807L18.1072 5.46255L18.1235 5.42342L18.1235 5.42338C18.225 5.17928 18.3307 4.925 18.4355 4.72498C18.527 4.5503 18.749 4.14166 19.2065 3.9089Z" fill="currentColor"/>
</svg>
`, E3 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 5.83337C12.176 5.83337 5.83337 12.176 5.83337 20C5.83337 27.8241 12.176 34.1667 20 34.1667C27.8241 34.1667 34.1667 27.8241 34.1667 20C34.1667 12.176 27.8241 5.83337 20 5.83337ZM20 3.33337C29.2048 3.33337 36.6667 10.7953 36.6667 20C36.6667 29.2048 29.2048 36.6667 20 36.6667C10.7953 36.6667 3.33337 29.2048 3.33337 20C3.33337 10.7953 10.7953 3.33337 20 3.33337ZM21.25 27.0834C21.25 27.4717 21.25 27.6658 21.1866 27.8189C21.102 28.0231 20.9398 28.1854 20.7356 28.2699C20.5825 28.3334 20.3883 28.3334 20 28.3334C19.6118 28.3334 19.4176 28.3334 19.2645 28.2699C19.0603 28.1854 18.8981 28.0231 18.8135 27.8189C18.75 27.6658 18.75 27.4717 18.75 27.0834V18.75C18.75 18.3618 18.75 18.1676 18.8135 18.0145C18.8981 17.8103 19.0603 17.6481 19.2645 17.5635C19.4176 17.5 19.6118 17.5 20 17.5C20.3883 17.5 20.5825 17.5 20.7356 17.5635C20.9398 17.6481 21.102 17.8103 21.1866 18.0145C21.25 18.1676 21.25 18.3618 21.25 18.75V27.0834ZM18.3334 13.3335C18.3334 12.413 19.0796 11.6668 20 11.6668C20.9205 11.6668 21.6667 12.413 21.6667 13.3335C21.6667 14.254 20.9205 15.0001 20 15.0001C19.0796 15.0001 18.3334 14.254 18.3334 13.3335Z" fill="currentColor"/>
</svg>
`, D1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 34.1667C12.176 34.1667 5.83337 27.8241 5.83337 20C5.83337 12.176 12.176 5.83337 20 5.83337C27.8241 5.83337 34.1667 12.176 34.1667 20C34.1667 27.8241 27.8241 34.1667 20 34.1667ZM20 36.6667C29.2048 36.6667 36.6667 29.2048 36.6667 20C36.6667 10.7953 29.2048 3.33337 20 3.33337C10.7953 3.33337 3.33337 10.7953 3.33337 20C3.33337 29.2048 10.7953 36.6667 20 36.6667ZM23.8316 12.2706C22.9311 11.476 21.7432 11.0742 20.2383 11.0742C18.5109 11.0742 17.1837 11.5638 16.2284 12.5225L16.2256 12.5253C15.2681 13.4639 14.7777 14.7447 14.7777 16.3984V16.4698H17.3207V16.3984C17.3207 15.465 17.5077 14.7102 17.9158 14.1736C18.3751 13.5256 19.1118 13.2423 20.0794 13.2423C20.855 13.2423 21.5016 13.4466 21.9507 13.8869L21.9569 13.8929C22.3847 14.3345 22.5883 14.9307 22.5883 15.6639C22.5883 16.2231 22.3699 16.743 21.9674 17.2473L21.9533 17.2649L21.5727 17.6795L20.8883 18.2881L20.5931 18.5626L20.0676 19.0792C19.5112 19.6512 19.1703 20.0993 19.0071 20.4439L19.0039 20.4507L18.9203 20.6173C18.6985 21.1069 18.5687 21.8333 18.5493 23.0588H21.1431C21.2294 21.267 22.0012 20.3644 22.4232 20.0147L23.2125 19.3319L23.9584 18.6577L24.1957 18.4261L24.3459 18.263C24.923 17.5345 25.2221 16.6117 25.2221 15.5081C25.2221 14.142 24.7518 13.0599 23.8351 12.2736L23.8316 12.2706ZM19.8698 28.3334C20.7903 28.3334 21.5365 27.5872 21.5365 26.6667C21.5365 25.7462 20.7903 25 19.8698 25C18.9494 25 18.2032 25.7462 18.2032 26.6667C18.2032 27.5872 18.9494 28.3334 19.8698 28.3334Z" fill="currentColor"/>
</svg>
`, T1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.7301 5.51443C11.6667 5.66757 11.6667 5.86172 11.6667 6.25V6.66667H10.3333C8.46649 6.66667 7.53307 6.66667 6.82003 7.02998C6.19282 7.34956 5.68289 7.85949 5.36331 8.4867C5 9.19974 5 10.1332 5 12V29.6667C5 31.5335 5 32.4669 5.36331 33.18C5.68289 33.8072 6.19282 34.3171 6.82003 34.6367C7.53307 35 8.46649 35 10.3333 35H29.6667C31.5335 35 32.4669 35 33.18 34.6367C33.8072 34.3171 34.3171 33.8072 34.6367 33.18C35 32.4669 35 31.5335 35 29.6667V12C35 10.1332 35 9.19974 34.6367 8.4867C34.3171 7.85949 33.8072 7.34956 33.18 7.02998C32.4669 6.66667 31.5335 6.66667 29.6667 6.66667H28.3333V6.25C28.3333 5.86172 28.3333 5.66757 28.2699 5.51443C28.1853 5.31024 28.0231 5.14801 27.8189 5.06343C27.6658 5 27.4716 5 27.0833 5C26.695 5 26.5009 5 26.3478 5.06343C26.1436 5.14801 25.9813 5.31024 25.8968 5.51443C25.8333 5.66757 25.8333 5.86172 25.8333 6.25V6.66667H14.1667V6.25C14.1667 5.86172 14.1667 5.66757 14.1032 5.51443C14.0187 5.31024 13.8564 5.14801 13.6522 5.06343C13.4991 5 13.305 5 12.9167 5C12.5284 5 12.3342 5 12.1811 5.06343C11.9769 5.14801 11.8147 5.31024 11.7301 5.51443ZM25.8333 12.0833C25.8333 12.4716 25.8333 12.6658 25.8968 12.8189C25.9813 13.0231 26.1436 13.1853 26.3478 13.2699C26.5009 13.3333 26.695 13.3333 27.0833 13.3333C27.4716 13.3333 27.6658 13.3333 27.8189 13.2699C28.0231 13.1853 28.1853 13.0231 28.2699 12.8189C28.3333 12.6658 28.3333 12.4716 28.3333 12.0833V9.16667H29.6667C30.6413 9.16667 31.222 9.16861 31.6524 9.20378C31.9151 9.22524 32.0255 9.25356 32.0551 9.26275C32.2039 9.34115 32.3255 9.46275 32.4039 9.61154C32.4131 9.64114 32.4414 9.75156 32.4629 10.0143C32.4981 10.4447 32.5 11.0253 32.5 12V15.8333H7.5V12C7.5 11.0253 7.50194 10.4447 7.53711 10.0143C7.55857 9.75156 7.58689 9.64114 7.59608 9.61154C7.67448 9.46274 7.79608 9.34115 7.94487 9.26275C7.97447 9.25356 8.08489 9.22524 8.34759 9.20378C8.77801 9.16861 9.35866 9.16667 10.3333 9.16667H11.6667V12.0833C11.6667 12.4716 11.6667 12.6658 11.7301 12.8189C11.8147 13.0231 11.9769 13.1853 12.1811 13.2699C12.3342 13.3333 12.5284 13.3333 12.9167 13.3333C13.305 13.3333 13.4991 13.3333 13.6522 13.2699C13.8564 13.1853 14.0187 13.0231 14.1032 12.8189C14.1667 12.6658 14.1667 12.4716 14.1667 12.0833V9.16667H25.8333V12.0833ZM32.5 18.3333V29.6667C32.5 30.6413 32.4981 31.222 32.4629 31.6524C32.4414 31.9151 32.4131 32.0255 32.4039 32.0551C32.3255 32.2039 32.2039 32.3255 32.0551 32.4039C32.0255 32.4131 31.9151 32.4414 31.6524 32.4629C31.222 32.4981 30.6413 32.5 29.6667 32.5H10.3333C9.35866 32.5 8.77801 32.4981 8.34759 32.4629C8.08489 32.4414 7.97448 32.4131 7.94488 32.4039C7.79608 32.3255 7.67448 32.2039 7.59608 32.0551C7.5869 32.0255 7.55857 31.9151 7.53711 31.6524C7.50194 31.222 7.5 30.6413 7.5 29.6667V18.3333H32.5ZM32.4009 9.60292C32.4009 9.60292 32.4016 9.60438 32.4028 9.60791L32.4009 9.60292ZM32.4009 32.0638L32.4028 32.0588C32.4016 32.0623 32.4009 32.0638 32.4009 32.0638ZM32.0638 32.4009C32.0638 32.4009 32.0623 32.4016 32.0587 32.4028L32.0638 32.4009ZM7.94131 32.4028L7.93635 32.401L7.93893 32.402L7.94131 32.4028ZM7.59909 32.0638C7.59909 32.0638 7.5984 32.0623 7.59722 32.0587L7.59909 32.0638ZM7.59909 9.60292L7.59722 9.60796C7.5984 9.60441 7.59909 9.60292 7.59909 9.60292ZM7.93625 9.26576C7.93625 9.26576 7.93774 9.26506 7.9413 9.26389L7.93625 9.26576Z" fill="currentColor"/>
</svg>
`, P1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7.5V32.5H10.8333V7.5H7.5ZM5.09382 5.44919C5 5.6298 5 5.86709 5 6.34167V33.6583C5 34.1329 5 34.3702 5.09382 34.5508C5.17289 34.703 5.29699 34.8271 5.44919 34.9062C5.6298 35 5.86709 35 6.34167 35H11.9917C12.4662 35 12.7035 35 12.8841 34.9062C13.0363 34.8271 13.1604 34.703 13.2395 34.5508C13.3333 34.3702 13.3333 34.1329 13.3333 33.6583V6.34167C13.3333 5.86709 13.3333 5.6298 13.2395 5.44919C13.1604 5.29699 13.0363 5.17289 12.8841 5.09382C12.7035 5 12.4662 5 11.9917 5H6.34167C5.86709 5 5.6298 5 5.44919 5.09382C5.29699 5.17289 5.17289 5.29699 5.09382 5.44919ZM18.3333 15.8333V32.5H21.6667V15.8333H18.3333ZM15.9272 13.7825C15.8333 13.9631 15.8333 14.2004 15.8333 14.675V33.6583C15.8333 34.1329 15.8333 34.3702 15.9272 34.5508C16.0062 34.703 16.1303 34.8271 16.2825 34.9062C16.4631 35 16.7004 35 17.175 35H22.825C23.2996 35 23.5369 35 23.7175 34.9062C23.8697 34.8271 23.9938 34.703 24.0728 34.5508C24.1667 34.3702 24.1667 34.1329 24.1667 33.6583V14.675C24.1667 14.2004 24.1667 13.9631 24.0728 13.7825C23.9938 13.6303 23.8697 13.5062 23.7175 13.4272C23.5369 13.3333 23.2996 13.3333 22.825 13.3333H17.175C16.7004 13.3333 16.4631 13.3333 16.2825 13.4272C16.1303 13.5062 16.0062 13.6303 15.9272 13.7825ZM29.1667 32.5V24.1667H32.5V32.5H29.1667ZM26.6667 23.0083C26.6667 22.5338 26.6667 22.2965 26.7605 22.1159C26.8396 21.9637 26.9637 21.8396 27.1159 21.7605C27.2965 21.6667 27.5338 21.6667 28.0083 21.6667H33.6583C34.1329 21.6667 34.3702 21.6667 34.5508 21.7605C34.703 21.8396 34.8271 21.9637 34.9062 22.1159C35 22.2965 35 22.5338 35 23.0083V33.6583C35 34.1329 35 34.3702 34.9062 34.5508C34.8271 34.703 34.703 34.8271 34.5508 34.9062C34.3702 35 34.1329 35 33.6583 35H28.0083C27.5338 35 27.2965 35 27.1159 34.9062C26.9637 34.8271 26.8396 34.703 26.7605 34.5508C26.6667 34.3702 26.6667 34.1329 26.6667 33.6583V23.0083Z" fill="currentColor"/>
</svg>
`, B1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5241 10.4166C14.055 12.1071 15.6343 13.3333 17.5 13.3333C19.8012 13.3333 21.6667 11.4679 21.6667 9.16667C21.6667 6.86548 19.8012 5 17.5 5C15.6343 5 14.0551 6.22617 13.5241 7.91659H6.25C5.86172 7.91659 5.66757 7.91659 5.51443 7.98002C5.31024 8.0646 5.14801 8.22683 5.06343 8.43102C5 8.58416 5 8.7783 5 9.16658C5 9.55487 5 9.74901 5.06343 9.90215C5.14801 10.1063 5.31024 10.2686 5.51443 10.3532C5.66757 10.4166 5.86172 10.4166 6.25 10.4166H13.5241ZM19.1667 9.16667C19.1667 10.0871 18.4205 10.8333 17.5 10.8333C16.5795 10.8333 15.8333 10.0871 15.8333 9.16667C15.8333 8.24619 16.5795 7.5 17.5 7.5C18.4205 7.5 19.1667 8.24619 19.1667 9.16667Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.3333 30.8333C18.3333 33.1345 16.4679 35 14.1667 35C12.301 35 10.7216 33.7738 10.1907 32.0833H6.25C5.86172 32.0833 5.66757 32.0833 5.51443 32.0198C5.31024 31.9352 5.14801 31.773 5.06343 31.5688C5 31.4157 5 31.2215 5 30.8333C5 30.445 5 30.2508 5.06343 30.0977C5.14801 29.8935 5.31024 29.7313 5.51443 29.6467C5.66757 29.5833 5.86172 29.5833 6.25 29.5833H10.1908C10.7217 27.8928 12.301 26.6667 14.1667 26.6667C16.4679 26.6667 18.3333 28.5321 18.3333 30.8333ZM15.8333 30.8333C15.8333 31.7538 15.0871 32.5 14.1667 32.5C13.2462 32.5 12.5 31.7538 12.5 30.8333C12.5 29.9129 13.2462 29.1667 14.1667 29.1667C15.0871 29.1667 15.8333 29.9129 15.8333 30.8333Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.9759 18.75C28.445 17.0595 26.8657 15.8333 25 15.8333C22.6988 15.8333 20.8333 17.6988 20.8333 20C20.8333 22.3012 22.6988 24.1667 25 24.1667C26.8657 24.1667 28.445 22.9405 28.9759 21.25H33.75C34.1383 21.25 34.3324 21.25 34.4856 21.1866C34.6898 21.102 34.852 20.9398 34.9366 20.7356C35 20.5824 35 20.3883 35 20C35 19.6117 35 19.4176 34.9366 19.2644C34.852 19.0602 34.6898 18.898 34.4856 18.8134C34.3324 18.75 34.1383 18.75 33.75 18.75H28.9759ZM25 21.6667C25.9205 21.6667 26.6667 20.9205 26.6667 20C26.6667 19.0795 25.9205 18.3333 25 18.3333C24.0795 18.3333 23.3333 19.0795 23.3333 20C23.3333 20.9205 24.0795 21.6667 25 21.6667Z" fill="currentColor"/>
<path d="M24.1667 9.16658C24.1667 9.60209 24.0999 10.022 23.9759 10.4166H33.75C34.1383 10.4166 34.3324 10.4166 34.4856 10.3532C34.6898 10.2686 34.852 10.1063 34.9366 9.90215C35 9.74901 35 9.55487 35 9.16658C35 8.7783 35 8.58416 34.9366 8.43102C34.852 8.22683 34.6898 8.0646 34.4856 7.98002C34.3324 7.91659 34.1383 7.91659 33.75 7.91659H23.9759C24.0999 8.31119 24.1667 8.73108 24.1667 9.16658Z" fill="currentColor"/>
<path d="M5.06343 19.2644C5 19.4176 5 19.6117 5 20C5 20.3883 5 20.5824 5.06343 20.7356C5.14801 20.9398 5.31024 21.102 5.51443 21.1866C5.66757 21.25 5.86172 21.25 6.25 21.25H18.5241C18.4001 20.8554 18.3333 20.4355 18.3333 20C18.3333 19.5645 18.4001 19.1446 18.5241 18.75H6.25C5.86172 18.75 5.66757 18.75 5.51443 18.8134C5.31024 18.898 5.14801 19.0602 5.06343 19.2644Z" fill="currentColor"/>
<path d="M20.6426 32.0833H33.75C34.1383 32.0833 34.3324 32.0833 34.4856 32.0198C34.6898 31.9352 34.852 31.773 34.9366 31.5688C35 31.4157 35 31.2215 35 30.8333C35 30.445 35 30.2508 34.9366 30.0977C34.852 29.8935 34.6898 29.7313 34.4856 29.6467C34.3324 29.5833 34.1383 29.5833 33.75 29.5833H20.6426C20.7665 29.9779 20.8333 30.3978 20.8333 30.8333C20.8333 31.2688 20.7665 31.6887 20.6426 32.0833Z" fill="currentColor"/>
</svg>
`, E1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.3334 12.4113C15.346 15.3732 17.5607 17.5 20.009 17.5C22.4514 17.5 24.6667 15.3642 24.6667 12.4046C24.6667 9.5838 22.5177 7.5 20.009 7.5C17.5115 7.5 15.3213 9.64042 15.3334 12.4111L15.3334 12.4113ZM20.009 5C23.9716 5 27.1667 8.27746 27.1667 12.4046C27.1667 16.6012 23.9716 20 20.009 20C16.0464 20 12.8513 16.6185 12.8334 12.422C12.8156 8.32948 16.0642 5 20.009 5ZM9.29155 28.3987C8.89622 28.7182 8.78695 28.8135 8.70873 28.8989C8.67671 28.9339 8.61506 29.0016 8.49611 29.2507C8.41866 29.4128 8.38844 29.5224 8.36742 29.7027C8.337 29.9637 8.33337 30.2962 8.33337 31.0038V32.4999H31.6667V31.0039C31.6667 30.2962 31.6631 29.9637 31.6327 29.7027C31.6116 29.5224 31.5814 29.4129 31.504 29.2507C31.385 29.0017 31.3234 28.9339 31.2913 28.8989C31.2131 28.8135 31.1038 28.7182 30.7085 28.3987C28.9718 26.9954 25.552 25 20 25C14.448 25 11.0282 26.9954 9.29155 28.3987ZM5.83337 31.0038C5.83337 29.6846 5.83337 29.025 6.24021 28.1732C6.64704 27.3214 7.00479 27.0324 7.72029 26.4542C9.83044 24.7491 13.7907 22.5 20 22.5C26.2093 22.5 30.1696 24.7491 32.2798 26.4542C32.9953 27.0323 33.353 27.3214 33.7599 28.1732C34.1667 29.025 34.1667 29.6846 34.1667 31.0039V33.3333C34.1667 34.119 34.1667 34.5118 33.9226 34.7559C33.6786 34.9999 33.2857 34.9999 32.5 34.9999H7.50004C6.71437 34.9999 6.32153 34.9999 6.07745 34.7559C5.83337 34.5118 5.83337 34.119 5.83337 33.3333V31.0038Z" fill="currentColor"/>
</svg>
`, I1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66671 9.16663C7.69203 9.16663 7.11138 9.16857 6.68096 9.20374C6.41826 9.2252 6.30784 9.25352 6.27825 9.2627C6.12945 9.3411 6.00785 9.4627 5.92945 9.6115C5.92027 9.6411 5.89195 9.75152 5.87049 10.0142C5.83532 10.4446 5.83337 11.0253 5.83337 12V12.3502L19.9996 19.4357L34.1667 12.3498V12C34.1667 11.0253 34.1648 10.4446 34.1296 10.0142C34.1081 9.75152 34.0798 9.6411 34.0706 9.6115C33.9922 9.46271 33.8706 9.34111 33.7218 9.26271C33.6922 9.25352 33.5818 9.2252 33.3191 9.20374C32.8887 9.16857 32.308 9.16663 31.3334 9.16663H8.66671ZM5.83337 15.1455V28C5.83337 28.9746 5.83532 29.5553 5.87049 29.9857C5.89195 30.2484 5.92027 30.3588 5.92945 30.3884C6.00785 30.5372 6.12945 30.6588 6.27825 30.7372C6.30785 30.7464 6.41827 30.7747 6.68096 30.7962C7.11138 30.8313 7.69203 30.8333 8.66671 30.8333H31.3334C32.308 30.8333 32.8887 30.8313 33.3191 30.7962C33.5818 30.7747 33.6922 30.7464 33.7218 30.7372C33.8706 30.6588 33.9922 30.5372 34.0706 30.3884C34.0798 30.3588 34.1081 30.2484 34.1296 29.9857C34.1648 29.5553 34.1667 28.9746 34.1667 28V15.1451L20.5588 21.9513C20.2068 22.1273 19.7925 22.1273 19.4405 21.9513L5.83337 15.1455ZM33.7305 9.26572L33.7254 9.26386C33.729 9.26503 33.7306 9.26568 33.7305 9.26572ZM34.0676 9.60287C34.0677 9.60278 34.0683 9.60434 34.0695 9.60788L34.0676 9.60287ZM34.0676 30.397L34.0695 30.392C34.0683 30.3956 34.0676 30.3972 34.0676 30.397ZM33.7305 30.7342C33.7306 30.7342 33.729 30.7349 33.7255 30.736L33.7305 30.7342ZM6.26962 30.7342L6.27468 30.7361C6.27112 30.7349 6.26953 30.7342 6.26962 30.7342ZM5.93246 30.397C5.93243 30.3971 5.93177 30.3956 5.9306 30.392L5.93246 30.397ZM5.93246 9.60287L5.9306 9.60792C5.93177 9.60436 5.93243 9.60278 5.93246 9.60287ZM6.26962 9.26572C6.26953 9.26568 6.27111 9.26502 6.27467 9.26385L6.26962 9.26572ZM3.33337 12C3.33337 10.1331 3.33337 9.1997 3.69669 8.48666C4.01626 7.85945 4.5262 7.34952 5.15341 7.02994C5.86644 6.66663 6.79987 6.66663 8.66671 6.66663H31.3334C33.2002 6.66663 34.1336 6.66663 34.8467 7.02994C35.4739 7.34952 35.9838 7.85945 36.3034 8.48666C36.6667 9.1997 36.6667 10.1331 36.6667 12V28C36.6667 29.8668 36.6667 30.8002 36.3034 31.5133C35.9838 32.1405 35.4739 32.6504 34.8467 32.97C34.1336 33.3333 33.2002 33.3333 31.3334 33.3333H8.66671C6.79987 33.3333 5.86644 33.3333 5.15341 32.97C4.5262 32.6504 4.01626 32.1405 3.69669 31.5133C3.33337 30.8002 3.33337 29.8668 3.33337 28V12Z" fill="currentColor"/>
</svg>
`, O1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.89414 4.54614L6.32102 7.18235C5.11051 8.42252 4.5346 10.0639 4.87671 11.6803C5.82742 16.1722 8.51485 21.2379 13.6394 26.3625C18.7638 31.487 23.8293 34.1743 28.3215 35.1252C29.938 35.4673 31.5793 34.8914 32.8195 33.6808L35.4557 31.1077C36.5531 30.0366 36.415 28.2337 35.1671 27.3423L28.5933 22.6467L28.3892 22.5154C27.3477 21.9153 26.0055 22.1548 25.2397 23.1121L24.0478 24.6004L23.7017 24.4244L23.3646 24.2381C22.1051 23.5185 20.6811 22.4231 19.13 20.8719C17.5788 19.3208 16.4834 17.8967 15.7637 16.6372L15.4972 16.1468L15.3995 15.9537L16.8897 14.7623C17.9109 13.9454 18.1153 12.4728 17.3552 11.4087L12.6596 4.83482C11.7682 3.58693 9.96529 3.44871 8.89414 4.54614ZM10.6511 6.32375L15.2995 12.8321L13.122 14.575C12.7403 14.8803 12.5716 15.3801 12.6901 15.8542C13.0557 17.3167 14.4111 19.6885 17.3622 22.6397C20.3133 25.5908 22.6852 26.9461 24.1476 27.3117L24.3262 27.3428C24.7436 27.3847 25.1596 27.2138 25.4268 26.8799L27.1695 24.7021L33.6761 29.3487L31.0733 31.8918C30.3979 32.551 29.5833 32.8368 28.8392 32.6794C24.813 31.8271 20.1835 29.3711 15.4072 24.5948C10.6307 19.8183 8.17462 15.1885 7.32253 11.1627C7.16505 10.4186 7.45092 9.60388 8.11006 8.92858L10.6511 6.32375Z" fill="currentColor"/>
</svg>
`, F1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.3334 9.16663C32.308 9.16663 32.8887 9.16857 33.3191 9.20374C33.5818 9.2252 33.6922 9.25352 33.7218 9.26271C33.8706 9.34111 33.9922 9.46271 34.0706 9.6115C34.0798 9.6411 34.1081 9.75152 34.1296 10.0142C34.1648 10.4446 34.1667 11.0253 34.1667 12V23.8333C34.1667 24.808 34.1648 25.3886 34.1296 25.819C34.1081 26.0817 34.0798 26.1921 34.0706 26.2217C33.9922 26.3705 33.8706 26.4921 33.7218 26.5705C33.6922 26.5797 33.5818 26.6081 33.3191 26.6295C32.8887 26.6647 32.308 26.6666 31.3334 26.6666H23.3334H16.6667H8.66671C7.69203 26.6666 7.11138 26.6647 6.68096 26.6295C6.41827 26.6081 6.30785 26.5797 6.27825 26.5705C6.12945 26.4921 6.00785 26.3705 5.92945 26.2218C5.92027 26.1922 5.89195 26.0817 5.87049 25.819C5.83532 25.3886 5.83337 24.808 5.83337 23.8333V12C5.83337 11.0253 5.83532 10.4446 5.87049 10.0142C5.89195 9.75152 5.92027 9.6411 5.92945 9.6115C6.00785 9.4627 6.12945 9.3411 6.27825 9.2627C6.30784 9.25352 6.41826 9.2252 6.68096 9.20374C7.11138 9.16857 7.69203 9.16663 8.66671 9.16663H31.3334ZM8.66671 29.1666H15.9524L15.2381 31.6666H12.9167C12.5284 31.6666 12.3343 31.6666 12.1811 31.7301C11.9769 31.8146 11.8147 31.9769 11.7301 32.1811C11.6667 32.3342 11.6667 32.5283 11.6667 32.9166C11.6667 33.3049 11.6667 33.4991 11.7301 33.6522C11.8147 33.8564 11.9769 34.0186 12.1811 34.1032C12.3343 34.1666 12.5284 34.1666 12.9167 34.1666H27.0834C27.4717 34.1666 27.6658 34.1666 27.8189 34.1032C28.0231 34.0186 28.1854 33.8564 28.2699 33.6522C28.3334 33.4991 28.3334 33.3049 28.3334 32.9166C28.3334 32.5283 28.3334 32.3342 28.2699 32.1811C28.1854 31.9769 28.0231 31.8146 27.8189 31.7301C27.6658 31.6666 27.4717 31.6666 27.0834 31.6666H24.7619L24.0477 29.1666H31.3334C33.2002 29.1666 34.1336 29.1666 34.8467 28.8033C35.4739 28.4837 35.9838 27.9738 36.3034 27.3466C36.6667 26.6336 36.6667 25.7001 36.6667 23.8333V12C36.6667 10.1331 36.6667 9.1997 36.3034 8.48666C35.9838 7.85945 35.4739 7.34952 34.8467 7.02994C34.1336 6.66663 33.2002 6.66663 31.3334 6.66663H8.66671C6.79987 6.66663 5.86644 6.66663 5.15341 7.02994C4.5262 7.34952 4.01626 7.85945 3.69669 8.48666C3.33337 9.1997 3.33337 10.1331 3.33337 12V23.8333C3.33337 25.7001 3.33337 26.6336 3.69669 27.3466C4.01626 27.9738 4.5262 28.4837 5.15341 28.8033C5.86644 29.1666 6.79987 29.1666 8.66671 29.1666ZM33.7305 9.26572L33.7254 9.26386C33.729 9.26503 33.7306 9.26568 33.7305 9.26572ZM34.0676 9.60287C34.0677 9.60278 34.0683 9.60434 34.0695 9.60788L34.0676 9.60287ZM34.0676 26.2304L34.0695 26.2254C34.0683 26.2289 34.0676 26.2305 34.0676 26.2304ZM33.7305 26.5675C33.7306 26.5676 33.729 26.5682 33.7255 26.5694L33.7305 26.5675ZM6.26962 26.5675L6.27467 26.5694C6.27111 26.5682 6.26952 26.5676 6.26962 26.5675ZM5.93246 26.2304C5.93243 26.2305 5.93177 26.2289 5.9306 26.2253L5.93246 26.2304ZM5.93246 9.60287L5.9306 9.60792C5.93177 9.60436 5.93243 9.60278 5.93246 9.60287ZM6.26962 9.26572C6.26953 9.26568 6.27111 9.26502 6.27467 9.26385L6.26962 9.26572Z" fill="currentColor"/>
</svg>
`, N1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.5 5.83337C26.4747 5.83337 27.0553 5.83532 27.4858 5.87049C27.5455 5.87537 27.5974 5.88061 27.6423 5.88589C27.8077 5.90539 27.9715 5.95967 28.0893 6.07746V6.07746C28.2071 6.19523 28.2613 6.35904 28.2808 6.52446C28.2861 6.5693 28.2914 6.62119 28.2962 6.68096C28.3314 7.11138 28.3334 7.69203 28.3334 8.66671V31.3334C28.3334 32.308 28.3314 32.8887 28.2962 33.3191C28.2914 33.3789 28.2861 33.4308 28.2808 33.4756C28.2613 33.641 28.2071 33.8048 28.0893 33.9226V33.9226C27.9715 34.0404 27.8077 34.0947 27.6422 34.1142C27.5974 34.1195 27.5455 34.1247 27.4858 34.1296C27.0553 34.1648 26.4747 34.1667 25.5 34.1667H14.5C13.5253 34.1667 12.9447 34.1648 12.5143 34.1296C12.4545 34.1247 12.4026 34.1195 12.3578 34.1142C12.1924 34.0947 12.0285 34.0404 11.9107 33.9226V33.9226C11.793 33.8048 11.7387 33.641 11.7192 33.4756C11.7139 33.4308 11.7087 33.3789 11.7038 33.3191C11.6686 32.8887 11.6667 32.308 11.6667 31.3334V8.66671C11.6667 7.69203 11.6686 7.11138 11.7038 6.68096C11.7087 6.6212 11.7139 6.56931 11.7192 6.52447C11.7387 6.35905 11.793 6.19523 11.9108 6.07745V6.07745C12.0285 5.95967 12.1924 5.90539 12.3578 5.88589C12.4026 5.88061 12.4545 5.87537 12.5143 5.87049C12.9447 5.83532 13.5253 5.83337 14.5 5.83337H15.4222C15.6488 5.83337 15.8334 6.0234 15.8334 6.25004V6.25004C15.8334 6.63833 15.8334 6.83247 15.8968 6.98561C15.9814 7.1898 16.1436 7.35203 16.3478 7.43661C16.5009 7.50004 16.6951 7.50004 17.0834 7.50004H22.9167C23.305 7.50004 23.4991 7.50004 23.6523 7.43661C23.8564 7.35203 24.0187 7.1898 24.1033 6.98561C24.1667 6.83247 24.1667 6.63833 24.1667 6.25004V6.25004C24.1667 6.02341 24.3512 5.83337 24.5778 5.83337H25.5ZM27.8958 5.9319C27.8967 5.93223 27.8966 5.93229 27.8958 5.93197L27.8921 5.9306L27.8958 5.9319V5.9319ZM28.2346 6.27062C28.2344 6.26998 28.2344 6.26994 28.2347 6.27058V6.27058L28.2361 6.27466L28.2346 6.27062ZM28.2361 33.7254C28.235 33.7287 28.2349 33.7287 28.2361 33.7254V33.7254V33.7254ZM27.8921 34.0695C27.8953 34.0683 27.8954 34.0684 27.8921 34.0695V34.0695V34.0695ZM12.108 34.0695C12.1047 34.0684 12.1047 34.0683 12.108 34.0695V34.0695V34.0695ZM11.7639 33.7255C11.7651 33.7287 11.765 33.7287 11.7639 33.7255V33.7255V33.7255ZM11.7639 6.27467C11.765 6.27137 11.7651 6.27141 11.7639 6.27467V6.27467V6.27467ZM12.108 5.9306C12.1047 5.9318 12.1047 5.93169 12.108 5.9306V5.9306V5.9306ZM9.53 5.15341C9.16669 5.86644 9.16669 6.79987 9.16669 8.66671V31.3334C9.16669 33.2002 9.16669 34.1336 9.53 34.8467C9.84958 35.4739 10.3595 35.9838 10.9867 36.3034C11.6998 36.6667 12.6332 36.6667 14.5 36.6667H25.5C27.3669 36.6667 28.3003 36.6667 29.0133 36.3034C29.6405 35.9838 30.1505 35.4739 30.47 34.8467C30.8334 34.1336 30.8334 33.2002 30.8334 31.3334V8.66671C30.8334 6.79987 30.8334 5.86644 30.47 5.15341C30.1505 4.5262 29.6405 4.01626 29.0133 3.69669C28.3003 3.33337 27.3669 3.33337 25.5 3.33337H14.5C12.6332 3.33337 11.6998 3.33337 10.9867 3.69669C10.3595 4.01626 9.84958 4.5262 9.53 5.15341ZM15.0635 29.6811C15 29.8343 15 30.0284 15 30.4167C15 30.805 15 30.9991 15.0635 31.1523C15.148 31.3565 15.3103 31.5187 15.5145 31.6033C15.6676 31.6667 15.8617 31.6667 16.25 31.6667H23.75C24.1383 31.6667 24.3324 31.6667 24.4856 31.6033C24.6898 31.5187 24.852 31.3565 24.9366 31.1523C25 30.9991 25 30.805 25 30.4167C25 30.0284 25 29.8343 24.9366 29.6811C24.852 29.4769 24.6898 29.3147 24.4856 29.2301C24.3324 29.1667 24.1383 29.1667 23.75 29.1667H16.25C15.8617 29.1667 15.6676 29.1667 15.5145 29.2301C15.3103 29.3147 15.148 29.4769 15.0635 29.6811Z" fill="currentColor"/>
</svg>
`, j1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.48666 3.69669C7.85945 4.01626 7.34952 4.5262 7.02994 5.15341C6.66663 5.86644 6.66663 6.79987 6.66663 8.66671V31.3334C6.66663 33.2002 6.66663 34.1336 7.02994 34.8467C7.34952 35.4739 7.85945 35.9838 8.48666 36.3034C9.1997 36.6667 10.1331 36.6667 12 36.6667H28C29.8668 36.6667 30.8002 36.6667 31.5133 36.3034C32.1405 35.9838 32.6504 35.4739 32.97 34.8467C33.3333 34.1336 33.3333 33.2002 33.3333 31.3334V19.3334C33.3333 13.7328 33.3333 10.9326 32.2434 8.79347C31.2846 6.91185 29.7548 5.38204 27.8732 4.42331C25.7341 3.33337 22.9338 3.33337 17.3333 3.33337H12C10.1331 3.33337 9.1997 3.33337 8.48666 3.69669ZM10.0142 34.1296C9.75152 34.1081 9.6411 34.0798 9.6115 34.0706C9.4627 33.9922 9.34111 33.8706 9.26271 33.7218C9.25352 33.6922 9.2252 33.5818 9.20374 33.3191C9.16857 32.8887 9.16663 32.308 9.16663 31.3334V8.66671C9.16663 7.69204 9.16857 7.11138 9.20374 6.68096C9.2252 6.41827 9.25352 6.30785 9.2627 6.27825C9.3411 6.12945 9.4627 6.00785 9.6115 5.92945C9.6411 5.92027 9.75152 5.89195 10.0142 5.87049C10.4446 5.83532 11.0253 5.83337 12 5.83337H17.3333C19.2729 5.83337 20.8115 5.83428 22.0833 5.87493V10L22.0833 10.0463V10.0464C22.0833 10.5901 22.0832 11.0713 22.1158 11.4702C22.1505 11.8949 22.2283 12.3349 22.4466 12.7633C22.7662 13.3905 23.2761 13.9005 23.9033 14.2201C24.3317 14.4383 24.7718 14.5161 25.1965 14.5508C25.5953 14.5834 26.0766 14.5834 26.6203 14.5834L26.6666 14.5834H30.7917C30.8324 15.8551 30.8333 17.3937 30.8333 19.3334V31.3334C30.8333 32.308 30.8313 32.8887 30.7962 33.3191C30.7747 33.5818 30.7464 33.6922 30.7372 33.7218C30.6588 33.8706 30.5372 33.9922 30.3884 34.0706C30.3588 34.0798 30.2484 34.1081 29.9857 34.1296C29.5553 34.1648 28.9746 34.1667 28 34.1667H12C11.0253 34.1667 10.4446 34.1648 10.0142 34.1296ZM24.5833 6.05513C25.5723 6.18816 26.2205 6.38702 26.7382 6.65083C28.1494 7.36988 29.2968 8.51723 30.0158 9.92845C30.2797 10.4462 30.4785 11.0943 30.6115 12.0834H26.6666C26.0626 12.0834 25.6848 12.0824 25.4001 12.0591C25.13 12.0371 25.0555 12.0013 25.0383 11.9925C24.8815 11.9127 24.754 11.7852 24.6741 11.6284C24.6653 11.6111 24.6296 11.5367 24.6075 11.2666C24.5843 10.9819 24.5833 10.6041 24.5833 10V6.05513ZM9.60288 34.0676L9.60789 34.0695C9.60435 34.0683 9.60277 34.0676 9.60288 34.0676ZM9.26572 33.7305C9.26568 33.7306 9.26503 33.729 9.26387 33.7255L9.26572 33.7305ZM9.26572 6.26962L9.26385 6.27467C9.26502 6.27111 9.26568 6.26953 9.26572 6.26962ZM9.60287 5.93246C9.60278 5.93243 9.60436 5.93177 9.60792 5.9306L9.60287 5.93246ZM30.7342 33.7305L30.7361 33.7254C30.7349 33.7289 30.7343 33.7305 30.7342 33.7305ZM30.397 34.0676C30.3971 34.0677 30.3955 34.0683 30.392 34.0695L30.397 34.0676ZM13.3333 20C13.3333 19.6118 13.3333 19.4176 13.3967 19.2645C13.4813 19.0603 13.6435 18.8981 13.8477 18.8135C14.0009 18.75 14.195 18.75 14.5833 18.75H25.4166C25.8049 18.75 25.9991 18.75 26.1522 18.8135C26.3564 18.8981 26.5186 19.0603 26.6032 19.2645C26.6666 19.4176 26.6666 19.6118 26.6666 20C26.6666 20.3883 26.6666 20.5825 26.6032 20.7356C26.5186 20.9398 26.3564 21.102 26.1522 21.1866C25.9991 21.25 25.8049 21.25 25.4166 21.25H14.5833C14.195 21.25 14.0009 21.25 13.8477 21.1866C13.6435 21.102 13.4813 20.9398 13.3967 20.7356C13.3333 20.5825 13.3333 20.3883 13.3333 20ZM13.3967 12.1811C13.3333 12.3343 13.3333 12.5284 13.3333 12.9167C13.3333 13.305 13.3333 13.4991 13.3967 13.6523C13.4813 13.8565 13.6435 14.0187 13.8477 14.1033C14.0009 14.1667 14.195 14.1667 14.5833 14.1667H18.75C19.1382 14.1667 19.3324 14.1667 19.4855 14.1033C19.6897 14.0187 19.8519 13.8565 19.9365 13.6523C20 13.4991 20 13.305 20 12.9167C20 12.5284 20 12.3343 19.9365 12.1811C19.8519 11.9769 19.6897 11.8147 19.4855 11.7301C19.3324 11.6667 19.1382 11.6667 18.75 11.6667H14.5833C14.195 11.6667 14.0009 11.6667 13.8477 11.7301C13.6435 11.8147 13.4813 11.9769 13.3967 12.1811ZM13.3333 27.0834C13.3333 26.6951 13.3333 26.5009 13.3967 26.3478C13.4813 26.1436 13.6435 25.9814 13.8477 25.8968C14.0009 25.8334 14.195 25.8334 14.5833 25.8334H25.4166C25.8049 25.8334 25.9991 25.8334 26.1522 25.8968C26.3564 25.9814 26.5186 26.1436 26.6032 26.3478C26.6666 26.5009 26.6666 26.6951 26.6666 27.0834C26.6666 27.4717 26.6666 27.6658 26.6032 27.8189C26.5186 28.0231 26.3564 28.1854 26.1522 28.2699C25.9991 28.3334 25.8049 28.3334 25.4166 28.3334H14.5833C14.195 28.3334 14.0009 28.3334 13.8477 28.2699C13.6435 28.1854 13.4813 28.0231 13.3967 27.8189C13.3333 27.6658 13.3333 27.4717 13.3333 27.0834Z" fill="currentColor"/>
</svg>
`, q1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.0084 9.6344C22.8465 9.3103 23.7667 9.14772 24.5319 9.38147C25.205 9.58728 25.7967 10.0019 26.2203 10.5641C26.7015 11.2031 26.8641 12.1222 27.1881 13.9596L29.6774 28.0758L29.8864 29.2946C30.0576 30.364 30.1045 31.0245 29.9293 31.5983L29.8424 31.8473C29.6176 32.417 29.2395 32.9161 28.7477 33.2867L28.6237 33.3727C28.1585 33.6775 27.5422 33.846 26.567 34.0338L25.3502 34.2545L9.59338 37.0328C7.87033 37.3367 6.95462 37.4975 6.21643 37.3239L6.07092 37.2848C5.39777 37.079 4.80607 36.6653 4.38245 36.1031C4.02147 35.6239 3.84023 34.987 3.63538 33.9235L3.41467 32.7067L0.926392 18.5905C0.602298 16.7524 0.439625 15.8332 0.673462 15.068C0.879269 14.3948 1.29392 13.8041 1.85608 13.3805C2.49509 12.8991 3.41392 12.7367 5.25159 12.4127L21.0084 9.6344ZM5.26526 28.8033L5.87756 32.2731C6.0467 33.2323 6.14909 33.8037 6.25842 34.2213C6.32329 34.469 6.36979 34.5741 6.38538 34.6051C6.48867 34.739 6.63058 34.8387 6.79163 34.8903C6.8239 34.8942 6.9385 34.9027 7.19788 34.8785C7.62765 34.8384 8.1998 34.74 9.15881 34.5709L22.4528 32.2262L9.48303 24.3014L5.26526 28.8033ZM23.4059 11.7877C22.9758 11.8279 22.4028 11.9271 21.443 12.0963L5.68616 14.8746C4.72662 15.0438 4.1546 15.1461 3.73694 15.2555C3.48589 15.3213 3.38148 15.3685 3.35217 15.3834C3.21856 15.4868 3.11937 15.6288 3.06799 15.7897C3.064 15.8228 3.05568 15.9371 3.07971 16.1949C3.09976 16.4099 3.13527 16.6604 3.18616 16.9772L3.38831 18.1569L4.72327 25.7262L7.89124 22.3453L8.02209 22.2174C8.70089 21.6092 9.70661 21.5096 10.4967 21.9918L26.0406 31.4879L25.9703 31.6012C26.3455 31.5307 26.6303 31.4724 26.8658 31.4108C27.1175 31.3449 27.2215 31.2976 27.2506 31.2828C27.3842 31.1794 27.4825 31.0375 27.5338 30.8766C27.5378 30.843 27.547 30.7287 27.5231 30.4723C27.483 30.0424 27.3836 29.4698 27.2145 28.5104L24.7262 14.3942C24.557 13.4347 24.4537 12.8626 24.3444 12.4449C24.2785 12.1934 24.2313 12.0893 24.2164 12.0602C24.1131 11.9267 23.9719 11.8274 23.8112 11.776C23.7786 11.772 23.6645 11.7636 23.4059 11.7877ZM16.0387 2.64417C16.6418 2.4599 17.2463 2.45141 17.8785 2.51038C18.4965 2.56802 19.2452 2.70148 20.1442 2.85999L33.8824 5.28284C34.7812 5.44131 35.5302 5.57197 36.1305 5.72913C36.7447 5.88998 37.3105 6.10357 37.8141 6.48303C38.587 7.0655 39.1561 7.87878 39.4391 8.80432C39.6233 9.40729 39.6299 10.012 39.5709 10.6442C39.5133 11.2621 39.3808 12.0109 39.2223 12.9098L36.6754 27.3551C36.2602 29.7083 34.0151 31.2788 31.6617 30.8639C30.9822 30.7437 30.5282 30.0953 30.6481 29.4156C30.7683 28.7362 31.4167 28.2823 32.0963 28.402C33.09 28.5772 34.0381 27.9141 34.2135 26.9205L36.7604 12.4752C36.926 11.5359 37.0357 10.9043 37.0817 10.4117C37.1262 9.93398 37.097 9.69674 37.0475 9.53479C36.9189 9.11429 36.6603 8.74581 36.3092 8.48108C36.1739 8.37917 35.96 8.26865 35.4957 8.14709C35.0172 8.02189 34.3867 7.9103 33.4479 7.74475L19.7096 5.32288C18.7701 5.15721 18.1387 5.04559 17.6461 4.99963C17.1686 4.95512 16.9311 4.98533 16.7692 5.03479C16.3487 5.16338 15.9802 5.42203 15.7155 5.77307C15.6135 5.90833 15.503 6.1213 15.3815 6.58557C15.2562 7.0642 15.1448 7.6959 14.9791 8.63538L14.903 9.06409C14.783 9.74382 14.1345 10.1986 13.4547 10.0787C12.7752 9.95869 12.3214 9.31008 12.441 8.63049L12.5172 8.20081C12.6757 7.30199 12.8063 6.5531 12.9635 5.95276C13.1243 5.33851 13.338 4.77281 13.7174 4.26917C14.2999 3.49618 15.1131 2.92716 16.0387 2.64417ZM19.067 15.899C20.4266 15.6593 21.7236 16.5678 21.9635 17.9274C22.2033 19.2871 21.2949 20.5841 19.9352 20.8239C18.5757 21.0631 17.2794 20.155 17.0397 18.7955C16.8002 17.4361 17.7077 16.139 19.067 15.899Z" fill="currentColor"/>
</svg>
`, W1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M33.544 24.1667H27.9607C28.1915 22.8242 28.3274 21.4246 28.3274 20C28.3274 18.5754 28.1915 17.1759 27.9607 15.8334H33.544C33.9488 17.1507 34.1666 18.5499 34.1666 20C34.1666 21.4501 33.9488 22.8493 33.544 24.1667ZM25.4202 24.1667H14.579C14.3238 22.8226 14.1717 21.4198 14.1717 20C14.1717 18.5803 14.3237 17.1775 14.579 15.8334H25.4202C25.6754 17.1775 25.8274 18.5803 25.8274 20C25.8274 21.4198 25.6754 22.8226 25.4202 24.1667ZM27.4116 13.3334C27.1088 12.1993 26.7502 11.1283 26.3657 10.1437C25.8517 8.82691 25.2802 7.63622 24.716 6.63728C28.0711 7.82138 30.8467 10.2333 32.5031 13.3334H27.4116ZM21.188 5.88248C21.875 6.63396 23.0375 8.49283 24.0369 11.0529C24.3173 11.771 24.581 12.5348 24.8155 13.3334H15.184C15.4184 12.5349 15.6822 11.7711 15.9627 11.053C16.9625 8.49277 18.1253 6.63381 18.8125 5.88244C19.204 5.84994 19.6001 5.83337 20 5.83337C20.4001 5.83337 20.7963 5.84996 21.188 5.88248ZM24.8155 26.6667C24.581 27.4653 24.3173 28.2291 24.0369 28.9472C23.0375 31.5072 21.875 33.3661 21.188 34.1176C20.7963 34.1501 20.4001 34.1667 20 34.1667C19.6001 34.1667 19.204 34.1501 18.8125 34.1176C18.1253 33.3663 16.9625 31.5073 15.9627 28.9471C15.6822 28.229 15.4184 27.4652 15.184 26.6667H24.8155ZM24.716 33.3628C25.2801 32.3639 25.8517 31.1732 26.3657 29.8564C26.7502 28.8718 27.1088 27.8007 27.4116 26.6667H32.5031C30.8467 29.7668 28.0711 32.1787 24.716 33.3628ZM11.6717 20C11.6717 21.4246 11.8077 22.8242 12.0385 24.1667H6.45598C6.05118 22.8493 5.83331 21.4501 5.83331 20C5.83331 18.5499 6.05118 17.1507 6.45598 15.8334H12.0385C11.8077 17.1759 11.6717 18.5754 11.6717 20ZM13.6339 10.1435C13.2494 11.1282 12.8906 12.1993 12.5878 13.3334H7.49681C9.15324 10.2333 11.9289 7.82132 15.2841 6.63724C14.7198 7.63616 14.1482 8.82683 13.6339 10.1435ZM7.49681 26.6667H12.5878C12.8906 27.8008 13.2494 28.8719 13.6339 29.8565C14.1482 31.1733 14.7198 32.3639 15.2841 33.3628C11.9289 32.1788 9.15324 29.7668 7.49681 26.6667ZM20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667Z" fill="currentColor"/>
</svg>
`, U1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 5C26.8962 5 32.5 10.6568 32.5 17.5C32.5 23.3438 28.8813 28.4074 20 34.2621C11.1187 28.4074 7.5 23.3438 7.5 17.5C7.5 10.6568 13.1038 5 20 5ZM5 17.5C5 25 10 30.9211 20 37.2368C30 30.9211 35 25 35 17.5C35 9.28346 28.2843 2.5 20 2.5C11.7157 2.5 5 9.28346 5 17.5ZM20 22.5C22.7614 22.5 25 20.2614 25 17.5C25 14.7386 22.7614 12.5 20 12.5C17.2386 12.5 15 14.7386 15 17.5C15 20.2614 17.2386 22.5 20 22.5Z" fill="currentColor"/>
</svg>
`, J1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M34.1667 20C34.1667 27.8241 27.8241 34.1667 20 34.1667C12.176 34.1667 5.83337 27.8241 5.83337 20C5.83337 12.176 12.176 5.83337 20 5.83337C27.8241 5.83337 34.1667 12.176 34.1667 20ZM36.6667 20C36.6667 29.2048 29.2048 36.6667 20 36.6667C10.7953 36.6667 3.33337 29.2048 3.33337 20C3.33337 10.7953 10.7953 3.33337 20 3.33337C29.2048 3.33337 36.6667 10.7953 36.6667 20ZM17.55 13.2605C16.44 12.5667 15 13.3647 15 14.6738V25.3263C15 26.6354 16.44 27.4334 17.55 26.7396L26.072 21.4134C27.1165 20.7606 27.1165 19.2395 26.072 18.5867L17.55 13.2605Z" fill="currentColor"/>
</svg>
`, Y1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.33333 5.41663C8.33333 5.02834 8.33333 4.8342 8.2699 4.68106C8.18532 4.47687 8.02309 4.31464 7.8189 4.23006C7.66576 4.16663 7.47162 4.16663 7.08333 4.16663C6.69505 4.16663 6.50091 4.16663 6.34776 4.23006C6.14357 4.31464 5.98135 4.47687 5.89677 4.68106C5.83333 4.8342 5.83333 5.02834 5.83333 5.41663V15H7.5H8.33333H14.5833C14.9716 15 15.1658 15 15.3189 14.9365C15.5231 14.8519 15.6853 14.6897 15.7699 14.4855C15.8333 14.3324 15.8333 14.1382 15.8333 13.75C15.8333 13.3617 15.8333 13.1675 15.7699 13.0144C15.6853 12.8102 15.5231 12.648 15.3189 12.5634C15.1658 12.5 14.9716 12.5 14.5833 12.5H9.99908C12.2796 9.46384 15.9105 7.49996 20 7.49996C26.9036 7.49996 32.5 13.0964 32.5 20C32.5 26.9035 26.9036 32.5 20 32.5C14.2508 32.5 9.4081 28.6186 7.94936 23.3333H5.37169C6.88746 30.0133 12.8614 35 20 35C28.2843 35 35 28.2842 35 20C35 11.7157 28.2843 4.99996 20 4.99996C15.2879 4.99996 11.0833 7.17274 8.33333 10.5711V5.41663Z" fill="currentColor"/>
</svg>
`, G1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.167 5.00024C19.6271 5.00042 20 5.37316 20 5.83325V6.66626C20 7.12639 19.6271 7.50007 19.167 7.50024H8.33301C7.87303 7.50042 7.50018 7.87327 7.5 8.33325V31.6672C7.50031 32.1271 7.87311 32.5001 8.33301 32.5002H31.667C32.1269 32.5001 32.4997 32.1271 32.5 31.6672V20.8333C32.5 20.3732 32.8729 20.0004 33.333 20.0002H34.167C34.6271 20.0004 35 20.3732 35 20.8333V31.6672L34.9961 31.8381C34.9069 33.5993 33.4503 35.0001 31.667 35.0002H8.33301L8.16211 34.9963C6.45751 34.9101 5.09027 33.5427 5.00391 31.8381L5 31.6672V8.33325L5.00391 8.16235C5.09015 6.45768 6.45743 5.0904 8.16211 5.00415L8.33301 5.00024H19.167ZM36.8701 2.48657C36.8981 2.48942 36.926 2.49372 36.9531 2.49927C37.1972 2.5493 37.4022 2.70661 37.5176 2.91919C37.5432 2.96641 37.5649 3.01644 37.5811 3.0686C37.6052 3.14659 37.6181 3.22975 37.6182 3.31567V14.1497C37.6178 14.6095 37.2451 14.9825 36.7852 14.9827H35.9512C35.4914 14.9823 35.1185 14.6094 35.1182 14.1497V6.98267L25.5352 16.5657C25.2098 16.8906 24.6828 16.8907 24.3574 16.5657L23.7676 15.9768C23.4424 15.6515 23.4425 15.1235 23.7676 14.7981L33.583 4.98267H25.9512C25.4914 4.98235 25.1185 4.60943 25.1182 4.14966V3.31567C25.1183 2.85577 25.4913 2.48299 25.9512 2.48267H36.7852L36.8701 2.48657Z" fill="currentColor"/>
</svg>
`, K1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.8807 15.5067C28.7309 15.5186 28.585 15.5604 28.4516 15.6297C28.3182 15.6989 28.2 15.7942 28.1041 15.9098C28.0081 16.0255 27.9363 16.1592 27.8928 16.3031C27.8494 16.4469 27.8352 16.5981 27.8512 16.7475C27.8671 16.897 27.9128 17.0417 27.9856 17.1732C28.0584 17.3047 28.1568 17.4202 28.275 17.513C28.3932 17.6059 28.5288 17.674 28.6738 17.7136C28.8188 17.7531 28.9703 17.7632 29.1193 17.7433L28.8807 15.5067ZM35.75 11C35.75 10.7016 35.6315 10.4155 35.4205 10.2045C35.2095 9.99353 34.9234 9.875 34.625 9.875C34.3266 9.875 34.0405 9.99353 33.8295 10.2045C33.6185 10.4155 33.5 10.7016 33.5 11H35.75ZM10.8808 17.7433C11.0297 17.7632 11.1812 17.7531 11.3262 17.7136C11.4712 17.674 11.6068 17.6059 11.725 17.513C11.8432 17.4202 11.9416 17.3047 12.0144 17.1732C12.0872 17.0417 12.1329 16.897 12.1488 16.7475C12.1648 16.5981 12.1506 16.4469 12.1072 16.3031C12.0637 16.1592 11.9919 16.0255 11.8959 15.9098C11.8 15.7942 11.6818 15.6989 11.5484 15.6297C11.415 15.5604 11.2691 15.5186 11.1192 15.5067L10.8808 17.7433ZM6.5 11C6.5 10.7016 6.38147 10.4155 6.1705 10.2045C5.95952 9.99353 5.67337 9.875 5.375 9.875C5.07663 9.875 4.79048 9.99353 4.5795 10.2045C4.36853 10.4155 4.25 10.7016 4.25 11H6.5ZM29 29L29.0956 27.8795L29.0484 27.875H29V29ZM33.5 33.5C33.5 33.7984 33.6185 34.0845 33.8295 34.2955C34.0405 34.5065 34.3266 34.625 34.625 34.625C34.9234 34.625 35.2095 34.5065 35.4205 34.2955C35.6315 34.0845 35.75 33.7984 35.75 33.5H33.5ZM11 29V27.875H10.9516L10.9044 27.8795L11 29ZM4.25 33.5C4.25 33.7984 4.36853 34.0845 4.5795 34.2955C4.79048 34.5065 5.07663 34.625 5.375 34.625C5.67337 34.625 5.95952 34.5065 6.1705 34.2955C6.38147 34.0845 6.5 33.7984 6.5 33.5H4.25ZM11 23.375C11.2984 23.375 11.5845 23.2565 11.7955 23.0455C12.0065 22.8345 12.125 22.5484 12.125 22.25C12.125 21.9516 12.0065 21.6655 11.7955 21.4545C11.5845 21.2435 11.2984 21.125 11 21.125V23.375ZM6.5 21.125C6.20163 21.125 5.91548 21.2435 5.7045 21.4545C5.49353 21.6655 5.375 21.9516 5.375 22.25C5.375 22.5484 5.49353 22.8345 5.7045 23.0455C5.91548 23.2565 6.20163 23.375 6.5 23.375V21.125ZM29 21.125C28.7016 21.125 28.4155 21.2435 28.2045 21.4545C27.9935 21.6655 27.875 21.9516 27.875 22.25C27.875 22.5484 27.9935 22.8345 28.2045 23.0455C28.4155 23.2565 28.7016 23.375 29 23.375V21.125ZM33.5 23.375C33.7984 23.375 34.0845 23.2565 34.2955 23.0455C34.5065 22.8345 34.625 22.5484 34.625 22.25C34.625 21.9516 34.5065 21.6655 34.2955 21.4545C34.0845 21.2435 33.7984 21.125 33.5 21.125V23.375ZM18.875 27.7141C18.875 28.0125 18.9935 28.2986 19.2045 28.5096C19.4155 28.7206 19.7016 28.8391 20 28.8391C20.2984 28.8391 20.5845 28.7206 20.7955 28.5096C21.0065 28.2986 21.125 28.0125 21.125 27.7141H18.875ZM21.125 18.0718C21.125 17.7734 21.0065 17.4872 20.7955 17.2763C20.5845 17.0653 20.2984 16.9468 20 16.9468C19.7016 16.9468 19.4155 17.0653 19.2045 17.2763C18.9935 17.4872 18.875 17.7734 18.875 18.0718H21.125ZM23.375 9.875V12.125H25.625V9.875H23.375ZM16.625 12.125V9.875H14.375V12.125H16.625ZM20 6.5C20.8951 6.5 21.7536 6.85558 22.3865 7.48851C23.0194 8.12145 23.375 8.97989 23.375 9.875H25.625C25.625 8.38316 25.0324 6.95242 23.9775 5.89752C22.9226 4.84263 21.4918 4.25 20 4.25V6.5ZM20 4.25C18.5082 4.25 17.0774 4.84263 16.0225 5.89752C14.9676 6.95242 14.375 8.38316 14.375 9.875H16.625C16.625 8.97989 16.9806 8.12145 17.6135 7.48851C18.2464 6.85558 19.1049 6.5 20 6.5V4.25ZM29.1193 17.7433C33.8971 17.2325 35.75 13.3321 35.75 11H33.5C33.5 12.4186 32.2929 15.1411 28.8807 15.5067L29.1193 17.7433ZM11.1192 15.5067C7.70712 15.14 6.5 12.4175 6.5 11H4.25C4.25 13.3321 6.10287 17.2325 10.8808 17.7433L11.1192 15.5067ZM28.9044 30.1205C32.5066 30.4288 33.5 32.6698 33.5 33.5H35.75C35.75 31.3299 33.6834 28.271 29.0956 27.8795L28.9044 30.1205ZM10.9044 27.8795C6.31662 28.271 4.25 31.3288 4.25 33.5H6.5C6.5 32.6698 7.49338 30.4288 11.0956 30.1205L10.9044 27.8795ZM11 21.125H6.5V23.375H11V21.125ZM29 23.375H33.5V21.125H29V23.375ZM16.04 13.25H23.96V11H16.04V13.25ZM27.875 17.165V25.625H30.125V17.165H27.875ZM12.125 25.625V17.165H9.875V25.625H12.125ZM23.96 13.25C24.9983 13.25 25.9941 13.6625 26.7283 14.3967C27.4625 15.1309 27.875 16.1267 27.875 17.165H30.125C30.125 15.5299 29.4755 13.9618 28.3193 12.8057C27.1632 11.6495 25.5951 11 23.96 11V13.25ZM16.04 11C14.4049 11 12.8368 11.6495 11.6807 12.8057C10.5245 13.9618 9.875 15.5299 9.875 17.165H12.125C12.125 16.1267 12.5375 15.1309 13.2717 14.3967C14.0059 13.6625 15.0017 13.25 16.04 13.25V11ZM21.125 27.7141V18.0718H18.875V27.7141H21.125ZM20 33.5C18.4309 33.5002 16.8975 33.0318 15.5963 32.1549C14.2951 31.278 13.2853 30.0326 12.6965 28.5781L10.6119 29.4219C11.3687 31.2916 12.6666 32.8928 14.3392 34.0202C16.0118 35.1476 17.9829 35.7499 20 35.75V33.5ZM12.6965 28.5781C12.3174 27.6398 12.1234 26.637 12.125 25.625H9.875C9.875 26.966 10.136 28.2485 10.6119 29.4219L12.6965 28.5781ZM11 30.125H11.6547V27.875H11V30.125ZM27.875 25.625C27.875 26.6713 27.6725 27.668 27.3024 28.5781L29.3881 29.4219C29.8761 28.2156 30.1263 26.9263 30.125 25.625H27.875ZM27.3024 28.5781C26.7137 30.0325 25.7042 31.2779 24.4032 32.1548C23.1022 33.0317 21.5689 33.5001 20 33.5V35.75C22.0171 35.7499 23.9882 35.1476 25.6608 34.0202C27.3334 32.8928 28.6313 31.2916 29.3881 29.4219L27.3024 28.5781ZM29 27.875H28.3464V30.125H29V27.875Z" fill="currentColor"/>
</svg>
`, X1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.4979 24.8597L26.0267 25.2136L25.7631 25.7407L24.1692 28.9286H15.8308L14.2368 25.7407L13.9733 25.2136L13.502 24.8597C10.8647 22.8791 9.16663 19.7335 9.16663 16.1905C9.16663 10.2074 14.0169 5.35718 20 5.35718C25.983 5.35718 30.8333 10.2074 30.8333 16.1905C30.8333 19.7334 29.1352 22.8791 26.4979 24.8597ZM14.2857 31.4286H25.7142L27.9992 26.8587C31.2382 24.4262 33.3333 20.553 33.3333 16.1905C33.3333 8.82672 27.3638 2.85718 20 2.85718C12.6362 2.85718 6.66663 8.82672 6.66663 16.1905C6.66663 20.553 8.76177 24.4262 12.0007 26.8587L14.2857 31.4286ZM21.9047 37.1429C24.0087 37.1429 25.7142 35.4373 25.7142 33.3334H14.2857C14.2857 35.4373 15.9913 37.1429 18.0952 37.1429H21.9047Z" fill="currentColor"/>
</svg>
`, Q1 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.66663 22.5C8.04734 22.5 9.16663 21.3807 9.16663 20C9.16663 18.6193 8.04734 17.5 6.66663 17.5C5.28591 17.5 4.16663 18.6193 4.16663 20C4.16663 21.3807 5.28591 22.5 6.66663 22.5ZM22.5 20C22.5 21.3807 21.3807 22.5 20 22.5C18.6192 22.5 17.5 21.3807 17.5 20C17.5 18.6193 18.6192 17.5 20 17.5C21.3807 17.5 22.5 18.6193 22.5 20ZM35.8333 20C35.8333 21.3807 34.714 22.5 33.3333 22.5C31.9526 22.5 30.8333 21.3807 30.8333 20C30.8333 18.6193 31.9526 17.5 33.3333 17.5C34.714 17.5 35.8333 18.6193 35.8333 20Z" fill="currentColor"/>
</svg>
`, t2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 33.3334C22.5 31.9527 21.3807 30.8334 20 30.8334C18.6193 30.8334 17.5 31.9527 17.5 33.3334C17.5 34.7141 18.6193 35.8334 20 35.8334C21.3807 35.8334 22.5 34.7141 22.5 33.3334ZM20 17.5C21.3807 17.5 22.5 18.6193 22.5 20C22.5 21.3808 21.3807 22.5 20 22.5C18.6193 22.5 17.5 21.3808 17.5 20C17.5 18.6193 18.6193 17.5 20 17.5ZM20 4.16671C21.3807 4.16671 22.5 5.286 22.5 6.66671C22.5 8.04742 21.3807 9.16671 20 9.16671C18.6193 9.16671 17.5 8.04742 17.5 6.66671C17.5 5.286 18.6193 4.16671 20 4.16671Z" fill="currentColor"/>
</svg>
`, e2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.645 14.3757C11.4062 14.2372 11.1002 14.3185 10.9617 14.5574L10.2091 15.8549C10.0705 16.0938 10.1519 16.3998 10.3907 16.5383L18.7497 21.3865V29.9166C18.7497 30.1927 18.9735 30.4166 19.2497 30.4166H20.7497C21.0258 30.4166 21.2497 30.1927 21.2497 29.9166V21.3868L29.6093 16.5383C29.8481 16.3997 29.9295 16.0938 29.7909 15.8549L29.0383 14.5574C28.8998 14.3185 28.5938 14.2372 28.355 14.3757L20 19.2216L11.645 14.3757Z" fill="currentColor"/>
<path d="M17.3415 4.36186C18.3102 3.80485 18.7945 3.52635 19.3092 3.41732C19.7647 3.32085 20.2353 3.32085 20.6907 3.41732C21.2054 3.52635 21.6898 3.80485 22.6585 4.36186L32.3252 9.92019C33.2995 10.4804 33.7867 10.7606 34.1411 11.1531C34.4546 11.5005 34.6915 11.91 34.8363 12.3549C35 12.8578 35 13.4198 35 14.5437V25.6227C35 26.7467 35 27.3086 34.8363 27.8115C34.6915 28.2565 34.4546 28.6659 34.1411 29.0133C33.7867 29.4059 33.2995 29.686 32.3252 30.2462L22.6585 35.8046C21.6898 36.3616 21.2054 36.6401 20.6907 36.7491C20.2353 36.8456 19.7647 36.8456 19.3092 36.7491C18.7945 36.6401 18.3102 36.3616 17.3415 35.8046L7.67481 30.2462C6.70047 29.686 6.2133 29.4059 5.85894 29.0133C5.54541 28.6659 5.30852 28.2565 5.16369 27.8115C5 27.3086 5 26.7467 5 25.6227V14.5437C5 13.4198 5 12.8578 5.16369 12.3549C5.30852 11.91 5.54541 11.5005 5.85894 11.1531C6.21329 10.7606 6.70047 10.4804 7.6748 9.9202L17.3415 4.36186ZM21.4123 6.52912C20.9031 6.23635 20.6136 6.07103 20.3885 5.95877C20.2497 5.88951 20.1878 5.86782 20.1712 5.86275C20.0583 5.83904 19.9417 5.83904 19.8287 5.86275C19.8121 5.86782 19.7503 5.88951 19.6114 5.95877C19.3863 6.07103 19.0968 6.23635 18.5876 6.52912L8.921 12.0875C8.40889 12.3819 8.11858 12.55 7.9071 12.689C7.77664 12.7747 7.72652 12.8175 7.71371 12.8294C7.63618 12.9156 7.57749 13.0171 7.5414 13.1273C7.53746 13.1443 7.52532 13.2091 7.51605 13.3649C7.50102 13.6175 7.5 13.953 7.5 14.5437V25.6227C7.5 26.2135 7.50102 26.5489 7.51605 26.8015C7.52532 26.9573 7.53746 27.0221 7.54139 27.0392C7.57749 27.1494 7.63618 27.2508 7.71372 27.337C7.72653 27.3489 7.77665 27.3918 7.9071 27.4775C8.11858 27.6164 8.40889 27.7845 8.92099 28.079L18.5876 33.6373C19.0968 33.9301 19.3863 34.0954 19.6114 34.2077C19.7503 34.2769 19.8121 34.2986 19.8287 34.3037C19.9417 34.3274 20.0583 34.3274 20.1712 34.3037C20.1879 34.2986 20.2497 34.2769 20.3885 34.2077C20.6136 34.0954 20.9031 33.9301 21.4123 33.6373L31.079 28.079C31.5911 27.7845 31.8814 27.6164 32.0929 27.4775C32.2233 27.3918 32.2735 27.349 32.2863 27.337C32.3638 27.2508 32.4225 27.1494 32.4586 27.0392C32.4625 27.0221 32.4747 26.9573 32.484 26.8015C32.499 26.5489 32.5 26.2135 32.5 25.6227V14.5437C32.5 13.953 32.499 13.6175 32.484 13.3649C32.4747 13.209 32.4625 13.1442 32.4586 13.1272C32.4225 13.017 32.3638 12.9156 32.2863 12.8294C32.2735 12.8175 32.2234 12.7747 32.0929 12.689C31.8814 12.55 31.5911 12.3819 31.079 12.0875L21.4123 6.52912ZM32.4573 13.1224C32.4573 13.1224 32.4578 13.1239 32.4586 13.1272L32.4573 13.1224ZM32.4573 27.044L32.4586 27.0392C32.4578 27.0425 32.4573 27.044 32.4573 27.044ZM32.2898 27.3335C32.2898 27.3335 32.2888 27.3347 32.2863 27.337L32.2898 27.3335ZM20.1712 34.3037L20.1664 34.305L20.168 34.3046L20.1712 34.3037ZM7.71017 27.3335L7.71372 27.337C7.71118 27.3347 7.71017 27.3335 7.71017 27.3335ZM7.54269 27.044C7.54269 27.044 7.54217 27.0425 7.54139 27.0392L7.54269 27.044ZM7.54269 13.1224L7.5414 13.1273C7.54217 13.1239 7.54269 13.1224 7.54269 13.1224ZM7.71017 12.8329C7.71017 12.8329 7.71119 12.8317 7.71371 12.8294L7.71017 12.8329ZM19.8335 5.86147L19.8287 5.86275C19.832 5.86175 19.8335 5.86147 19.8335 5.86147ZM20.1664 5.86147C20.1664 5.86147 20.1679 5.86175 20.1712 5.86275L20.1664 5.86147Z" fill="currentColor"/>
</svg>
`, i2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20 5C21.8409 5 23.3333 6.49238 23.3333 8.33333H16.6667C16.6667 6.49238 18.1591 5 20 5ZM6.66667 21.6667C6.66667 16.6041 10.7707 12.5 15.8333 12.5H24.1667C29.2293 12.5 33.3333 16.6041 33.3333 21.6667C33.3333 26.7293 29.2293 30.8333 24.1667 30.8333H15.8333C10.7707 30.8333 6.66667 26.7293 6.66667 21.6667ZM5.12929 17.0187C6.92531 12.8883 11.042 10 15.8333 10H24.1667C28.958 10 33.0747 12.8883 34.8707 17.0187L37.5 18.3333V23.3333L35.5308 24.318C34.3303 29.484 29.698 33.3333 24.1667 33.3333H15.8333C10.302 33.3333 5.66973 29.484 4.46924 24.318L2.5 23.3333V18.3333L5.12929 17.0187ZM15 16.6667C14.0795 16.6667 13.3333 17.4129 13.3333 18.3333V21.6667C13.3333 22.5871 14.0795 23.3333 15 23.3333C15.9205 23.3333 16.6667 22.5871 16.6667 21.6667V18.3333C16.6667 17.4129 15.9205 16.6667 15 16.6667ZM23.3333 18.3333C23.3333 17.4129 24.0795 16.6667 25 16.6667C25.9205 16.6667 26.6667 17.4129 26.6667 18.3333V21.6667C26.6667 22.5871 25.9205 23.3333 25 23.3333C24.0795 23.3333 23.3333 22.5871 23.3333 21.6667V18.3333Z" fill="currentColor"/>
</svg>
`, r2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36.6667 20C36.6667 29.2048 29.2048 36.6667 20 36.6667C10.7953 36.6667 3.33337 29.2048 3.33337 20C3.33337 10.7953 10.7953 3.33337 20 3.33337C29.2048 3.33337 36.6667 10.7953 36.6667 20ZM34.1667 20C34.1667 19.8607 34.1647 19.7218 34.1607 19.5834H28.2355L24.4261 26.4404C24.2069 26.8349 23.7922 27.0806 23.3409 27.0834C22.8896 27.0861 22.472 26.8454 22.2481 26.4535L16.682 16.713L13.5927 22.2738C13.3723 22.6706 12.954 22.9167 12.5 22.9167H6.13394C7.47855 29.3415 13.1758 34.1667 20 34.1667C27.8241 34.1667 34.1667 27.8241 34.1667 20ZM33.8661 17.0834C32.5215 10.6586 26.8243 5.83337 20 5.83337C12.176 5.83337 5.83337 12.176 5.83337 20C5.83337 20.1394 5.83539 20.2783 5.83938 20.4167H11.7645L15.574 13.5597C15.7932 13.1652 16.2079 12.9194 16.6592 12.9167C17.1104 12.914 17.5281 13.1547 17.752 13.5465L23.318 23.2871L26.4073 17.7263C26.6278 17.3295 27.0461 17.0834 27.5 17.0834H33.8661Z" fill="currentColor"/>
</svg>
`, o2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.5607 5.495C28.0592 4.18308 31.6609 3.96533 33.8478 6.15222C36.0346 8.33911 35.8169 11.9408 34.505 15.4393C33.9547 16.9068 33.1802 18.4437 32.212 19.9999C33.1803 21.5562 33.9547 23.0938 34.505 24.5614C35.8167 28.0597 36.0344 31.6607 33.8478 33.8475C31.6609 36.0344 28.0592 35.8167 24.5607 34.5048C23.0933 33.9545 21.5562 33.1809 20.0001 32.2128C18.4439 33.181 16.9061 33.9544 15.4386 34.5048C11.9402 35.8165 8.33928 36.0343 6.15247 33.8475C3.96566 31.6607 4.18346 28.0598 5.49524 24.5614C6.04551 23.094 6.81819 21.5559 7.78625 19.9999C6.81829 18.444 6.04548 16.9066 5.49524 15.4393C4.18332 11.9408 3.96558 8.33911 6.15247 6.15222C8.33927 3.96558 11.9403 4.18326 15.4386 5.495C16.9061 6.0453 18.444 6.81882 20.0001 7.78699C21.5562 6.81891 23.0933 6.04527 24.5607 5.495ZM9.33704 22.2782C8.71738 23.3686 8.21511 24.4311 7.83704 25.4393C6.58996 28.7651 6.85265 31.0126 7.92004 32.08C8.98746 33.1473 11.2349 33.41 14.5607 32.163C15.569 31.7848 16.6313 31.2818 17.7218 30.662C16.198 29.5351 14.6811 28.2336 13.2238 26.7762C11.7662 25.3187 10.464 23.8021 9.33704 22.2782ZM30.6613 22.2772C29.5343 23.801 28.2339 25.3188 26.7765 26.7762C25.3191 28.2336 23.8012 29.5341 22.2775 30.661C23.3682 31.281 24.4301 31.7847 25.4386 32.163C28.7642 33.41 31.0117 33.1471 32.0792 32.08C33.1466 31.0125 33.4094 28.7652 32.1622 25.4393C31.784 24.4307 31.2813 23.3681 30.6613 22.2772ZM19.9991 10.7802C18.3268 11.9427 16.6286 13.3539 14.9913 14.9911C13.3539 16.6285 11.943 18.3274 10.7804 19.9999C11.943 21.6724 13.3539 23.3712 14.9913 25.0087C16.6284 26.6458 18.3269 28.0562 19.9991 29.2186C21.6717 28.056 23.3714 26.6461 25.0089 25.0087C26.6462 23.3714 28.0563 21.6723 29.2189 19.9999C28.0563 18.3275 26.6462 16.6284 25.0089 14.9911C23.3713 13.3534 21.6719 11.9428 19.9991 10.7802ZM32.0792 7.9198C31.0116 6.85275 28.7641 6.59074 25.4386 7.83777C24.4303 8.21591 23.3679 8.71801 22.2775 9.33777C23.8014 10.4648 25.3189 11.766 26.7765 13.2235C28.2337 14.6807 29.5344 16.198 30.6613 17.7216C31.281 16.631 31.7841 15.5688 32.1622 14.5604C33.4093 11.2347 33.1466 8.9872 32.0792 7.9198ZM14.5607 7.83777C11.2349 6.59064 8.98753 6.85249 7.92004 7.9198C6.85267 8.98718 6.59005 11.2348 7.83704 14.5604C8.215 15.5683 8.71762 16.6305 9.33704 17.7206C10.4639 16.1969 11.7665 14.6808 13.2238 13.2235C14.6811 11.7662 16.1971 10.4637 17.7208 9.33679C16.6307 8.71736 15.5686 8.21575 14.5607 7.83777Z" fill="currentColor"/>
</svg>
`, n2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.75002 8.33333C3.75002 5.80203 5.80205 3.75 8.33335 3.75H10V6.25H8.33335C7.18276 6.25 6.25002 7.18274 6.25002 8.33333V16.6667C6.25002 17.98 5.69761 19.1644 4.81247 20C5.69761 20.8356 6.25002 22.02 6.25002 23.3333V31.6667C6.25002 32.8173 7.18276 33.75 8.33335 33.75H10V36.25H8.33335C5.80205 36.25 3.75002 34.198 3.75002 31.6667V23.3333C3.75002 22.1827 2.81728 21.25 1.66669 21.25V18.75C2.81728 18.75 3.75002 17.8173 3.75002 16.6667V8.33333ZM31.6667 36.25C34.198 36.25 36.25 34.198 36.25 31.6667V23.3333C36.25 22.1827 37.1828 21.25 38.3334 21.25V18.75C37.1828 18.75 36.25 17.8173 36.25 16.6667V8.33333C36.25 5.80203 34.198 3.75 31.6667 3.75H30L30 6.25H31.6667C32.8173 6.25 33.75 7.18274 33.75 8.33333V16.6667C33.75 17.98 34.3024 19.1644 35.1876 20C34.3024 20.8356 33.75 22.02 33.75 23.3333V31.6667C33.75 32.8173 32.8173 33.75 31.6667 33.75H30L30 36.25H31.6667Z" fill="currentColor" fill-opacity="0.93"/>
<path d="M25.8333 14.3334C26.2935 14.3334 26.6666 13.9603 26.6666 13.5V12.6667C26.6666 12.2065 26.2935 11.8334 25.8333 11.8334H14.1666C13.7064 11.8334 13.3333 12.2065 13.3333 12.6667V13.5C13.3333 13.9603 13.7064 14.3334 14.1666 14.3334H25.8333Z" fill="currentColor" fill-opacity="0.93"/>
<path d="M26.6666 20.6667C26.6666 21.1269 26.2935 21.5 25.8333 21.5H14.1666C13.7064 21.5 13.3333 21.1269 13.3333 20.6667V19.8334C13.3333 19.3731 13.7064 19 14.1666 19H25.8333C26.2935 19 26.6666 19.3731 26.6666 19.8334V20.6667Z" fill="currentColor" fill-opacity="0.93"/>
<path d="M25.8333 29C26.2935 29 26.6666 28.6269 26.6666 28.1667V27.3334C26.6666 26.8731 26.2935 26.5 25.8333 26.5H14.1666C13.7064 26.5 13.3333 26.8731 13.3333 27.3334V28.1667C13.3333 28.6269 13.7064 29 14.1666 29H25.8333Z" fill="currentColor" fill-opacity="0.93"/>
</svg>
`, a2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.2496 16.3336C21.2498 17.2079 21.9593 17.9166 22.8336 17.9166H30.0387L17.9166 34.5035V23.6666C17.9166 22.7923 17.2079 22.0838 16.3336 22.0836H9.12756L21.2496 5.49573V16.3336Z" stroke="black" stroke-width="2.5"/>
</svg>
`, s2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.752 29.3853C18.75 29.1123 18.75 28.8087 18.75 28.4711V9.84916C17.3972 9.24248 15.0769 8.44287 12.2957 8.44287C9.51174 8.44287 7.18958 9.24408 5.8374 9.85099V28.4711C5.8374 28.856 5.83765 29.1746 5.83995 29.4423C6.203 29.3541 6.64901 29.2399 7.20806 29.0963C8.66685 28.7216 10.3909 28.4429 12.2957 28.4429C14.2006 28.4429 15.9246 28.7216 17.3834 29.0963C17.9425 29.2399 18.3885 29.3541 18.7515 29.4423L18.752 29.3853ZM3.3374 9.79585C3.3374 9.28547 3.3374 9.03028 3.43346 8.75973C3.5083 8.54892 3.67831 8.28287 3.83817 8.12638C4.04332 7.92555 4.23882 7.83504 4.62981 7.65402C6.15621 6.94733 8.91958 5.94287 12.2957 5.94287C15.6719 5.94287 18.4353 6.94733 19.9617 7.65402L20.002 7.67271L20.0424 7.65402C21.5688 6.94733 24.3322 5.94287 27.7083 5.94287C31.0845 5.94287 33.8479 6.94733 35.3743 7.65402C35.7653 7.83504 35.9607 7.92555 36.1659 8.12638C36.3258 8.28287 36.4958 8.54892 36.5706 8.75973C36.6667 9.03028 36.6667 9.28547 36.6667 9.79585V28.4711C36.6667 30.1503 36.6667 30.99 36.4238 31.3891C36.1729 31.8014 35.9466 31.9769 35.485 32.1173C35.0379 32.2532 34.0833 32.0081 32.1741 31.5177C30.8836 31.1863 29.3702 30.9429 27.7083 30.9429C26.0464 30.9429 24.533 31.1863 23.2426 31.5177C22.9942 31.5815 22.762 31.6411 22.5449 31.6963C21.2748 32.0715 20 32.5651 20 32.5651C20 32.5651 18.7079 32.0648 17.4294 31.6888C17.2209 31.6357 16.9986 31.5786 16.7616 31.5177L16.7615 31.5177L16.7615 31.5177C15.471 31.1863 13.9576 30.9429 12.2957 30.9429C10.6339 30.9429 9.12045 31.1863 7.82997 31.5177C5.92074 32.0081 4.96612 32.2532 4.5191 32.1173C4.05742 31.9769 3.83114 31.8014 3.58029 31.3891C3.3374 30.99 3.3374 30.1503 3.3374 28.4711V9.79585ZM21.2521 29.3853L21.2525 29.4423C21.6156 29.3541 22.0616 29.2399 22.6207 29.0963C24.0794 28.7216 25.8035 28.4429 27.7083 28.4429C29.6132 28.4429 31.3372 28.7216 32.796 29.0963C33.3551 29.2399 33.8011 29.3541 34.1641 29.4423C34.1664 29.1746 34.1667 28.856 34.1667 28.4711V9.85099C32.8145 9.24408 30.4923 8.44287 27.7083 8.44287C24.9271 8.44287 22.6068 9.24248 21.2541 9.84916V28.4711C21.2541 28.8087 21.2541 29.1123 21.2521 29.3853Z" fill="currentColor"/>
</svg>
`, l2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.02994 5.15341C7.34952 4.5262 7.85945 4.01626 8.48666 3.69669C9.1997 3.33337 10.1331 3.33337 12 3.33337H18.3333H28H28.3333V3.33346C29.9805 3.33474 30.844 3.35567 31.5133 3.69669C32.1405 4.01626 32.6504 4.5262 32.97 5.15341C33.3333 5.86644 33.3333 6.79987 33.3333 8.66671V23C33.3333 24.8669 33.3333 25.8003 32.97 26.5133C32.6504 27.1405 32.1405 27.6505 31.5133 27.9701C30.844 28.3111 29.9805 28.332 28.3333 28.3333V28.3334H28H20H12.0833C10.4725 28.3334 9.16663 29.6392 9.16663 31.25C9.16663 32.8609 10.4725 34.1667 12.0833 34.1667H28.3333H30.8333H33.3333V36.6667H30.8333H12.0833C9.09175 36.6667 6.66663 34.2416 6.66663 31.25C6.66663 31.1351 6.67021 31.0209 6.67727 30.9077C6.66663 30.786 6.66663 30.6309 6.66663 30.4167V28.3334V25.8334V12.9167V8.66671C6.66663 6.79987 6.66663 5.86644 7.02994 5.15341ZM25.8333 5.83337H20.8333V13.6621L23.3333 11.9954L25.8333 13.6621V5.83337ZM18.3333 5.83337V17.7105C18.3333 17.9768 18.63 18.1356 18.8515 17.9879L23.3333 15L27.8151 17.9879C28.0366 18.1356 28.3333 17.9768 28.3333 17.7105V5.83351C29.1114 5.83431 29.6068 5.83953 29.9857 5.87049C30.2484 5.89195 30.3588 5.92027 30.3884 5.92945C30.5372 6.00785 30.6588 6.12945 30.7372 6.27825C30.7464 6.30783 30.7747 6.41825 30.7962 6.68096C30.8313 7.11138 30.8333 7.69203 30.8333 8.66671V23C30.8333 23.9747 30.8313 24.5554 30.7962 24.9858C30.7747 25.2485 30.7464 25.3589 30.7372 25.3885C30.6588 25.5373 30.5372 25.6589 30.3884 25.7373C30.3588 25.7465 30.2484 25.7748 29.9857 25.7963C29.5553 25.8314 28.9746 25.8334 28 25.8334H20H12.0833C11.0094 25.8334 10.0085 26.1459 9.16663 26.6849L9.16663 25.8334V23.3334V12.9167V8.66671C9.16663 7.69203 9.16857 7.11138 9.20374 6.68096C9.2252 6.41826 9.25352 6.30784 9.26271 6.27825C9.34111 6.12945 9.4627 6.00785 9.6115 5.92945C9.6411 5.92027 9.75152 5.89195 10.0142 5.87049C10.4446 5.83532 11.0253 5.83337 12 5.83337H18.3333ZM9.26572 6.26962L9.26385 6.27467C9.26502 6.27111 9.26568 6.26953 9.26572 6.26962ZM9.60288 5.93246C9.60278 5.93243 9.60436 5.93177 9.60792 5.9306L9.60288 5.93246ZM30.397 5.93246L30.392 5.9306C30.3956 5.93177 30.3971 5.93243 30.397 5.93246ZM30.7342 6.26962C30.7342 6.26953 30.7349 6.27111 30.7361 6.27467L30.7342 6.26962ZM30.7342 25.3971L30.7361 25.3921C30.7349 25.3956 30.7342 25.3972 30.7342 25.3971ZM30.397 25.7343C30.3971 25.7343 30.3955 25.735 30.392 25.7362L30.397 25.7343ZM11.7301 30.5145C11.6666 30.6676 11.6666 30.8618 11.6666 31.25C11.6666 31.6383 11.6666 31.8325 11.7301 31.9856C11.8146 32.1898 11.9769 32.352 12.1811 32.4366C12.3342 32.5 12.5283 32.5 12.9166 32.5H30.4166C30.8049 32.5 30.9991 32.5 31.1522 32.4366C31.3564 32.352 31.5186 32.1898 31.6032 31.9856C31.6666 31.8325 31.6666 31.6383 31.6666 31.25C31.6666 30.8618 31.6666 30.6676 31.6032 30.5145C31.5186 30.3103 31.3564 30.1481 31.1522 30.0635C30.9991 30 30.8049 30 30.4166 30H12.9166C12.5283 30 12.3342 30 12.1811 30.0635C11.9769 30.1481 11.8146 30.3103 11.7301 30.5145Z" fill="currentColor"/>
</svg>
`, d2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M36 26.25H34.0996C33.3904 28.4887 33.3136 29.7311 33.8662 31.75H36V34.25H10C7.1005 34.25 4.75 31.8995 4.75 29C4.75 26.1005 7.10051 23.75 10 23.75H36V26.25ZM10 26.25C8.48122 26.25 7.25 27.4812 7.25 29C7.25 30.5188 8.48122 31.75 10 31.75H31.29C30.8479 29.817 30.9127 28.3135 31.4893 26.25H10ZM20.5 4.25C28.9223 4.25 35.75 11.0777 35.75 19.5V21.5H33.25V19.5C33.25 12.4584 27.5416 6.75 20.5 6.75C13.4584 6.75 7.75 12.4584 7.75 19.5V21.5H5.25V19.5C5.25 11.0777 12.0777 4.25 20.5 4.25ZM20.167 9.83301C20.6271 9.83319 21 10.2069 21 10.667V17.333C21 17.7931 20.6271 18.1668 20.167 18.167H14.917C14.4568 18.167 14.083 17.7932 14.083 17.333V16.5C14.083 16.0398 14.4568 15.667 14.917 15.667H18.5V10.667C18.5 10.2069 18.8729 9.83318 19.333 9.83301H20.167Z" fill="currentColor"/>
</svg>
`, c2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 3.33301C29.2047 3.33301 36.667 10.7953 36.667 20C36.667 29.2047 29.2047 36.667 20 36.667C10.7953 36.667 3.33301 29.2047 3.33301 20C3.33303 10.7953 10.7953 3.33301 20 3.33301ZM20 5.83301C12.176 5.83301 5.83303 12.176 5.83301 20C5.83301 27.824 12.176 34.167 20 34.167C27.824 34.167 34.167 27.824 34.167 20C34.167 12.176 27.824 5.83301 20 5.83301ZM26.4443 12.4727C27.1245 12.2007 27.7991 12.8755 27.5273 13.5557L24.0664 22.209L23.999 22.3662C23.643 23.1389 23.0029 23.7488 22.209 24.0664L13.5557 27.5273C12.8756 27.7991 12.2009 27.1244 12.4727 26.4443L12.7979 25.6309L15.9346 17.791C16.2522 16.997 16.8619 16.3579 17.6348 16.002L17.791 15.9346L26.4443 12.4727ZM18.7197 18.2559C18.508 18.3406 18.3406 18.508 18.2559 18.7197L16.2383 23.7617L21.2812 21.7451C21.4926 21.6604 21.6604 21.4926 21.7451 21.2812L23.7617 16.2383L18.7197 18.2559Z" fill="currentColor"/>
</svg>
`, u2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.9175 7.50006C14.525 7.50006 15.8325 8.81006 15.8325 10.4176V13.7501C15.8325 14.0819 15.9644 14.4002 16.199 14.6348C16.4337 14.8695 16.7519 15.0013 17.0838 15.0013C17.4156 15.0013 17.7339 14.8695 17.9685 14.6348C18.2032 14.4002 18.335 14.0819 18.335 13.7501V10.4176C18.3337 8.98092 17.7626 7.60347 16.747 6.58738C15.7313 5.5713 14.3542 4.99954 12.9175 4.99756C12.753 4.99756 12.5902 5.02996 12.4382 5.0929C12.2863 5.15584 12.1482 5.2481 12.0319 5.36441C11.9156 5.48071 11.8233 5.61879 11.7604 5.77075C11.6974 5.92271 11.665 6.08558 11.665 6.25006C11.665 6.41454 11.6974 6.57741 11.7604 6.72937C11.8233 6.88133 11.9156 7.0194 12.0319 7.13571C12.1482 7.25202 12.2863 7.34427 12.4382 7.40722C12.5902 7.47016 12.753 7.50256 12.9175 7.50256V7.50006ZM21.7375 18.4076C21.4895 18.4085 21.2467 18.3356 21.0402 18.1982C20.8337 18.0607 20.6727 17.8649 20.5778 17.6357C20.483 17.4065 20.4584 17.1543 20.5073 16.9111C20.5562 16.6679 20.6764 16.4447 20.8525 16.2701C21.7825 15.3401 22.835 15.3851 23.4625 15.4101C24.005 15.4351 24.065 15.4151 24.1975 15.2851C24.3275 15.1526 24.3475 15.0926 24.3225 14.5526C24.2975 13.9251 24.2475 12.8726 25.18 11.9426C26.11 11.0126 27.1625 11.0576 27.79 11.0826C28.3325 11.1076 28.3925 11.0876 28.525 10.9576C28.6575 10.8226 28.675 10.7626 28.655 10.2176C28.63 9.59006 28.585 8.53756 29.5175 7.60756C30.4475 6.67506 31.5 6.72006 32.1275 6.74506C32.6725 6.76756 32.7325 6.74756 32.865 6.61506C32.9812 6.49884 33.1192 6.40665 33.2711 6.34375C33.4229 6.28085 33.5857 6.24848 33.75 6.24848C33.9144 6.24848 34.0771 6.28085 34.229 6.34375C34.3808 6.40665 34.5188 6.49884 34.635 6.61506C34.7512 6.73128 34.8434 6.86925 34.9063 7.0211C34.9692 7.17295 35.0016 7.3357 35.0016 7.50006C35.0016 7.66442 34.9692 7.82717 34.9063 7.97902C34.8434 8.13087 34.7512 8.26884 34.635 8.38506C33.705 9.31506 32.6525 9.27256 32.025 9.24756C31.48 9.22256 31.42 9.24506 31.2875 9.37756C31.155 9.51006 31.135 9.57006 31.1575 10.1151C31.1825 10.7426 31.225 11.7951 30.295 12.7251C29.365 13.6551 28.3125 13.6126 27.685 13.5851C27.1425 13.5626 27.0825 13.5826 26.95 13.7151C26.82 13.8451 26.8 13.9051 26.825 14.4451C26.85 15.0726 26.8975 16.1251 25.9675 17.0551C25.0375 17.9851 23.985 17.9401 23.3575 17.9126C22.815 17.8876 22.755 17.9101 22.625 18.0401C22.5086 18.1568 22.3703 18.2494 22.218 18.3125C22.0657 18.3755 21.9024 18.4079 21.7375 18.4076ZM20.025 8.16006C20.0562 8.32208 20.1194 8.47627 20.2108 8.61363C20.3022 8.75098 20.4201 8.86875 20.5575 8.96006C20.7029 9.05744 20.867 9.12323 21.0394 9.15318C21.2117 9.18313 21.3884 9.17657 21.5581 9.13392C21.7278 9.09127 21.8866 9.01348 22.0243 8.90558C22.162 8.79769 22.2755 8.66209 22.3575 8.50756C22.4142 8.39771 22.4563 8.28087 22.4825 8.16006C22.5329 7.91691 22.5087 7.66424 22.4133 7.43501C22.3179 7.20578 22.1555 7.01064 21.9475 6.87506C21.8471 6.80506 21.7355 6.75265 21.6175 6.72006C21.3405 6.63307 21.0417 6.64626 20.7735 6.75732C20.5052 6.86838 20.2845 7.07023 20.15 7.32756C20.0934 7.43655 20.0513 7.55256 20.025 7.67256C19.9921 7.83339 19.9921 7.99923 20.025 8.16006ZM11.8 15.0326C12.22 14.9326 12.665 15.0576 12.9725 15.3651L24.6375 27.0326C24.7889 27.1831 24.8991 27.3699 24.9578 27.5751C25.0165 27.7804 25.0217 27.9972 24.9728 28.205C24.9239 28.4128 24.8226 28.6046 24.6786 28.7622C24.5346 28.9197 24.3526 29.0378 24.15 29.1051L6.65003 34.9376C6.42944 35.0121 6.19241 35.0235 5.96566 34.9706C5.73892 34.9177 5.53147 34.8024 5.36669 34.6379C5.20192 34.4734 5.08637 34.2661 5.03307 34.0395C4.97977 33.8128 4.99084 33.5758 5.06503 33.3551L10.8975 15.8551C10.9645 15.6521 11.0824 15.4696 11.24 15.3252C11.3975 15.1808 11.5895 15.0791 11.7975 15.0301L11.8 15.0326ZM34.9075 18.2726C34.9731 18.4223 35.0063 18.5841 35.005 18.7476C35.005 18.9748 34.9433 19.1978 34.8267 19.3928C34.71 19.5878 34.5427 19.7475 34.3425 19.8551C34.1595 19.9501 33.9563 19.9998 33.75 20.0001C33.4611 19.998 33.1816 19.8974 32.9575 19.7151C32.8926 19.6637 32.8339 19.605 32.7825 19.5401C32.6773 19.4149 32.599 19.2693 32.5525 19.1126C32.4996 18.9454 32.4828 18.7688 32.5032 18.5947C32.5235 18.4205 32.5806 18.2526 32.6706 18.1021C32.7606 17.9516 32.8815 17.8219 33.0254 17.7216C33.1692 17.6212 33.3327 17.5526 33.505 17.5201C33.7893 17.461 34.0853 17.5037 34.3412 17.6408C34.5971 17.7779 34.7967 18.0007 34.905 18.2701L34.9075 18.2726ZM12.6325 18.5676L8.23253 31.7701L21.435 27.3701L12.635 18.5701L12.6325 18.5676ZM29.585 21.6651H26.25C25.9182 21.6651 25.5999 21.7969 25.3653 22.0315C25.1306 22.2662 24.9988 22.5845 24.9988 22.9163C24.9988 23.2482 25.1306 23.5664 25.3653 23.8011C25.5999 24.0357 25.9182 24.1676 26.25 24.1676H29.5825C31.19 24.1676 32.4975 25.4751 32.4975 27.0826C32.4975 27.4147 32.6295 27.7333 32.8644 27.9682C33.0993 28.2031 33.4178 28.3351 33.75 28.3351C34.0822 28.3351 34.4008 28.2031 34.6357 27.9682C34.8706 27.7333 35.0025 27.4147 35.0025 27.0826C35.0005 25.6459 34.4288 24.2687 33.4127 23.2531C32.3966 22.2375 31.0192 21.6664 29.5825 21.6651H29.585Z" fill="currentColor"/>
</svg>
`, p2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 20C22.5 21.3807 21.3807 22.5 20 22.5C18.6193 22.5 17.5 21.3807 17.5 20C17.5 18.6193 18.6193 17.5 20 17.5C21.3807 17.5 22.5 18.6193 22.5 20Z" fill="currentColor"/>
</svg>
`, h2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.1666 20C34.1666 27.8241 27.824 34.1667 20 34.1667C12.1759 34.1667 5.83331 27.8241 5.83331 20C5.83331 12.176 12.1759 5.83337 20 5.83337C27.824 5.83337 34.1666 12.176 34.1666 20ZM36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20Z" fill="currentColor"/>
</svg>
`, C2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.0332 3C28.9627 3 31.7182 4.14188 33.79 6.20996C35.8581 8.28184 37 11.0373 37 13.9668C36.9999 16.8961 35.8579 19.6509 33.79 21.7227C31.7182 23.7907 28.9627 24.9326 26.0332 24.9326C25.021 24.9326 24.0306 24.7931 23.0811 24.5293L18.2236 29.3799C18.0112 29.5923 17.7196 29.7138 17.4199 29.7139H14.915V32.2188C14.915 32.8487 14.4063 33.3574 13.7764 33.3574H11.2725V35.8613C11.2725 36.4912 10.7637 37 10.1338 37H4.13867C3.8351 37 3.54648 36.8785 3.33398 36.666C3.12148 36.4535 3 36.1649 3 35.8613V29.8662C3 29.5626 3.12148 29.274 3.33398 29.0615L15.4707 16.9238C15.206 15.9729 15.0674 14.9806 15.0674 13.9668C15.0674 11.0373 16.2093 8.28184 18.2773 6.20996C20.3491 4.14208 23.1039 3.00007 26.0332 3ZM5.27637 30.3369V34.7236H8.99512V32.2188C8.99512 31.5889 9.50394 31.0802 10.1338 31.0801H12.6387V28.5762C12.6387 27.9464 13.1466 27.4377 13.7764 27.4375H16.9492L20.7861 23.5996C19.8761 23.1028 19.031 22.475 18.2773 21.7227C17.5247 20.9686 16.8964 20.1233 16.3994 19.2129L5.27637 30.3369ZM26.0332 5.27637C23.711 5.27644 21.5289 6.18023 19.8896 7.82324C18.2505 9.46629 17.3438 11.6446 17.3438 13.9668C17.3438 14.97 17.513 15.9468 17.8369 16.8652C18.0996 17.6069 18.4687 18.3157 18.9248 18.9639C19.2109 19.3685 19.5316 19.7531 19.8896 20.1104C21.5327 21.7496 23.711 22.6562 26.0332 22.6562C28.3554 22.6562 30.5375 21.7533 32.1768 20.1104C33.8198 18.4711 34.7236 16.289 34.7236 13.9668C34.7236 11.6445 33.8198 9.46253 32.1768 7.82324C30.5375 6.18016 28.3555 5.27637 26.0332 5.27637ZM26.0332 10.3613C28.0216 10.3613 29.6387 11.9784 29.6387 13.9668C29.6385 15.9551 28.0215 17.5713 26.0332 17.5713C24.045 17.5711 22.4289 15.955 22.4287 13.9668C22.4287 11.9785 24.0449 10.3615 26.0332 10.3613ZM26.0332 12.6387C25.301 12.6388 24.7051 13.2345 24.7051 13.9668C24.7052 14.6989 25.3011 15.2948 26.0332 15.2949C26.7655 15.2949 27.3612 14.699 27.3613 13.9668C27.3613 13.2344 26.7656 12.6387 26.0332 12.6387Z" fill="currentColor"/>
</svg>
`, f2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.833 15.6758L15.4924 16.2596L11.8522 22.5H28.1472L24.5069 16.2597L24.1663 15.6758L24.1663 14.9999L24.1666 6.66663H15.833V15V15.6758ZM29.6056 25H10.3939L7.48099 29.9935C6.83286 31.1046 7.6343 32.5 8.92063 32.5H31.0789C32.3653 32.5 33.1667 31.1046 32.5185 29.9935L29.6056 25ZM26.6663 15L26.6666 6.66663H28.75C29.1383 6.66663 29.3325 6.66663 29.4856 6.60319C29.6898 6.51861 29.852 6.35639 29.9366 6.1522C30 5.99905 30 5.80491 30 5.41663C30 5.02834 30 4.8342 29.9366 4.68106C29.852 4.47687 29.6898 4.31464 29.4856 4.23006C29.3325 4.16663 29.1383 4.16663 28.75 4.16663H26.6667H24.1667H15.833H13.333H11.25C10.8618 4.16663 10.6676 4.16663 10.5145 4.23006C10.3103 4.31464 10.1481 4.47687 10.0635 4.68106C10 4.8342 10 5.02834 10 5.41663C10 5.80491 10 5.99905 10.0635 6.1522C10.1481 6.35639 10.3103 6.51861 10.5145 6.60319C10.6676 6.66663 10.8618 6.66663 11.25 6.66663H13.333V15L5.32154 28.7338C3.7012 31.5116 5.70483 35 8.92063 35H31.0789C34.2948 35 36.2984 31.5115 34.678 28.7338L26.6663 15Z" fill="currentColor"/>
</svg>
`, g2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.4194 14.9913C24.094 14.6658 24.094 14.1382 24.4194 13.8128L27.9113 10.3209C23.3209 6.55965 16.6791 6.55965 12.0887 10.3209L15.5806 13.8128C15.906 14.1382 15.906 14.6658 15.5806 14.9913L14.9913 15.5805C14.6659 15.906 14.1383 15.906 13.8128 15.5805L10.3209 12.0886C6.55969 16.6791 6.55969 23.3208 10.3209 27.9113L13.8128 24.4194C14.1383 24.0939 14.6659 24.0939 14.9913 24.4194L15.5806 25.0086C15.906 25.3341 15.906 25.8617 15.5806 26.1871L12.0887 29.679C16.6791 33.4403 23.3209 33.4403 27.9113 29.679L24.4194 26.1871C24.094 25.8617 24.094 25.3341 24.4194 25.0086L25.0087 24.4194C25.3341 24.0939 25.8617 24.0939 26.1872 24.4194L29.6791 27.9113C33.4403 23.3208 33.4403 16.6791 29.6791 12.0886L26.1872 15.5805C25.8617 15.906 25.3341 15.906 25.0087 15.5805L24.4194 14.9913ZM8.54582 10.3135C3.81806 15.8915 3.81806 24.1084 8.54582 29.6864L7.331 30.9012C7.00557 31.2266 7.00557 31.7543 7.331 32.0797L7.92026 32.669C8.2457 32.9944 8.77333 32.9944 9.09877 32.669L10.3136 31.4541C15.8916 36.1819 24.1084 36.1819 29.6864 31.4541L30.9012 32.669C31.2267 32.9944 31.7543 32.9944 32.0797 32.669L32.669 32.0797C32.9944 31.7543 32.9944 31.2266 32.669 30.9012L31.4542 29.6864C36.1819 24.1084 36.1819 15.8915 31.4542 10.3135L32.669 9.09873C32.9944 8.77329 32.9944 8.24565 32.669 7.92022L32.0797 7.33096C31.7543 7.00552 31.2267 7.00552 30.9012 7.33096L29.6864 8.54578C24.1084 3.81802 15.8916 3.81802 10.3136 8.54578L9.09877 7.33096C8.77333 7.00552 8.2457 7.00552 7.92026 7.33096L7.331 7.92022C7.00557 8.24565 7.00557 8.77329 7.331 9.09873L8.54582 10.3135ZM22.9463 22.9462C21.3191 24.5734 18.6809 24.5734 17.0537 22.9462C15.4265 21.3191 15.4265 18.6809 17.0537 17.0537C18.6809 15.4265 21.3191 15.4265 22.9463 17.0537C24.5735 18.6809 24.5735 21.3191 22.9463 22.9462ZM24.714 24.714C22.1105 27.3175 17.8895 27.3175 15.286 24.714C12.6825 22.1105 12.6825 17.8894 15.286 15.2859C17.8895 12.6824 22.1105 12.6824 24.714 15.2859C27.3175 17.8894 27.3175 22.1105 24.714 24.714Z" fill="currentColor"/>
</svg>
`, m2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.6963 6.2876C24.899 6.23681 25.1112 6.23718 25.3135 6.28955L34.0635 8.56299C34.3314 8.63246 34.5688 8.78848 34.7383 9.00732C34.9077 9.22632 35 9.49605 35 9.77295V32.5005C34.9998 32.6937 34.9544 32.8842 34.8682 33.0571C34.7819 33.2301 34.6572 33.3812 34.5029 33.4976C34.3485 33.6143 34.1687 33.6934 33.9785 33.729C33.7883 33.7646 33.5924 33.7557 33.4062 33.7026L24.9785 31.2935L15.3037 33.7124C15.101 33.7631 14.8888 33.7628 14.6865 33.7104L5.93652 31.438C5.6686 31.3685 5.43116 31.2115 5.26172 30.9927C5.09227 30.7737 5 30.504 5 30.2271V7.50049C4.99989 7.30692 5.04459 7.11517 5.13086 6.94189C5.21712 6.76871 5.34262 6.618 5.49707 6.50146C5.65159 6.38488 5.83118 6.30542 6.02148 6.27002C6.21173 6.23465 6.4077 6.24415 6.59375 6.29736L15.0215 8.70654L24.6963 6.2876ZM16.25 10.9751V30.8989L23.75 29.0239V9.1001L16.25 10.9751ZM7.5 29.2603L13.75 30.8833V10.9429L7.5 9.15771V29.2603ZM26.25 29.0562L32.5 30.8423V10.7397L26.25 9.11572V29.0562Z" fill="currentColor"/>
</svg>
`, v2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.1666 20C34.1666 27.8241 27.824 34.1667 20 34.1667C12.1759 34.1667 5.83331 27.8241 5.83331 20C5.83331 12.176 12.1759 5.83337 20 5.83337C27.824 5.83337 34.1666 12.176 34.1666 20ZM36.6666 20C36.6666 10.7953 29.2047 3.33337 20 3.33337C10.7952 3.33337 3.33331 10.7953 3.33331 20C3.33331 29.2048 10.7952 36.6667 20 36.6667C29.2047 36.6667 36.6666 29.2048 36.6666 20ZM27.7602 15.4019C27.6786 15.2582 27.5261 15.139 27.2211 14.9007C26.9156 14.662 26.7628 14.5426 26.6034 14.4983C26.3895 14.4388 26.1607 14.4671 25.9678 14.577C25.824 14.6588 25.705 14.8118 25.4669 15.1178L18.9958 23.4333L15.1456 19.1587L15.1456 19.1587C14.888 18.8727 14.7591 18.7296 14.611 18.6584C14.4102 18.5619 14.179 18.5498 13.9692 18.6248C13.8145 18.6802 13.6714 18.809 13.3853 19.0666L13.3853 19.0666C13.098 19.3253 12.9544 19.4546 12.8831 19.6032C12.7864 19.8048 12.7748 20.0367 12.8508 20.2469C12.9068 20.4019 13.0368 20.545 13.2967 20.8311L18.0909 26.1091C18.4696 26.526 18.6589 26.7345 18.8766 26.8017C19.0676 26.8607 19.2733 26.8491 19.4564 26.769C19.6652 26.6777 19.8299 26.4493 20.1593 25.9925L20.4439 25.5978C20.5049 25.5217 20.5751 25.4319 20.6589 25.3247L27.4361 16.6536L27.4361 16.6536C27.6745 16.3486 27.7937 16.1961 27.8381 16.0369C27.8977 15.8233 27.8696 15.5948 27.7602 15.4019Z" fill="currentColor"/>
</svg>
`, b2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 34.1667H12C11.0253 34.1667 10.4447 34.1648 10.0143 34.1296C9.75156 34.1081 9.64114 34.0798 9.61156 34.0706C9.46276 33.9922 9.34116 33.8706 9.26276 33.7218C9.25358 33.6922 9.22526 33.5818 9.2038 33.3191C9.16863 32.8887 9.16669 32.308 9.16669 31.3334V8.66671C9.16669 7.69203 9.16863 7.11138 9.2038 6.68096C9.22526 6.41827 9.25358 6.30785 9.26277 6.27825C9.34116 6.12945 9.46276 6.00785 9.61156 5.92945C9.64116 5.92027 9.75158 5.89195 10.0143 5.87049C10.4447 5.83532 11.0253 5.83337 12 5.83337H28C28.9747 5.83337 29.5553 5.83532 29.9858 5.87049C30.2485 5.89195 30.3589 5.92027 30.3885 5.92945C30.5373 6.00785 30.6589 6.12945 30.7373 6.27824C30.7465 6.30783 30.7748 6.41825 30.7962 6.68096C30.8314 7.11138 30.8334 7.69203 30.8334 8.66671V31.3334C30.8334 32.308 30.8314 32.8887 30.7962 33.3191C30.7748 33.5818 30.7465 33.6922 30.7373 33.7218C30.6589 33.8706 30.5373 33.9922 30.3885 34.0706C30.3589 34.0798 30.2484 34.1081 29.9858 34.1296C29.5553 34.1648 28.9747 34.1667 28 34.1667ZM9.60294 34.0676L9.60795 34.0695C9.60441 34.0683 9.60283 34.0676 9.60294 34.0676ZM9.26521 33.7292C9.26557 33.7301 9.26576 33.7305 9.26578 33.7305L9.26393 33.7255L9.26521 33.7292ZM9.26578 6.26962L9.26391 6.27467C9.26508 6.27111 9.26574 6.26953 9.26578 6.26962ZM9.60294 5.93246C9.60284 5.93243 9.60442 5.93177 9.60798 5.9306L9.60294 5.93246ZM30.3971 5.93246L30.3921 5.9306C30.3956 5.93177 30.3972 5.93243 30.3971 5.93246ZM30.7343 6.26962C30.7343 6.26952 30.735 6.27111 30.7361 6.27466L30.7343 6.26962ZM30.7343 33.7305L30.7361 33.7254C30.735 33.7289 30.7343 33.7305 30.7343 33.7305ZM30.3971 34.0676C30.3972 34.0677 30.3956 34.0683 30.3921 34.0695L30.3971 34.0676ZM12 3.33337C10.1332 3.33337 9.19976 3.33337 8.48672 3.69669C7.85951 4.01626 7.34958 4.5262 7.03 5.15341C6.66669 5.86644 6.66669 6.79987 6.66669 8.66671V31.3334C6.66669 33.2002 6.66669 34.1336 7.03 34.8467C7.34958 35.4739 7.85951 35.9838 8.48672 36.3034C9.19976 36.6667 10.1332 36.6667 12 36.6667H28C29.8669 36.6667 30.8003 36.6667 31.5133 36.3034C32.1405 35.9838 32.6505 35.4739 32.97 34.8467C33.3334 34.1336 33.3334 33.2002 33.3334 31.3334V8.66671C33.3334 6.79987 33.3334 5.86644 32.97 5.15341C32.6505 4.5262 32.1405 4.01626 31.5133 3.69669C30.8003 3.33337 29.8669 3.33337 28 3.33337H12ZM13.3968 12.1811C13.3334 12.3343 13.3334 12.5284 13.3334 12.9167C13.3334 13.305 13.3334 13.4991 13.3968 13.6523C13.4814 13.8565 13.6436 14.0187 13.8478 14.1033C14.0009 14.1667 14.1951 14.1667 14.5834 14.1667H25.4167C25.805 14.1667 25.9991 14.1667 26.1523 14.1033C26.3564 14.0187 26.5187 13.8565 26.6033 13.6523C26.6667 13.4991 26.6667 13.305 26.6667 12.9167C26.6667 12.5284 26.6667 12.3343 26.6033 12.1811C26.5187 11.9769 26.3564 11.8147 26.1523 11.7301C25.9991 11.6667 25.805 11.6667 25.4167 11.6667H14.5834C14.1951 11.6667 14.0009 11.6667 13.8478 11.7301C13.6436 11.8147 13.4814 11.9769 13.3968 12.1811ZM13.3334 20C13.3334 19.6118 13.3334 19.4176 13.3968 19.2645C13.4814 19.0603 13.6436 18.8981 13.8478 18.8135C14.0009 18.75 14.1951 18.75 14.5834 18.75H25.4167C25.805 18.75 25.9991 18.75 26.1523 18.8135C26.3564 18.8981 26.5187 19.0603 26.6033 19.2645C26.6667 19.4176 26.6667 19.6118 26.6667 20C26.6667 20.3883 26.6667 20.5825 26.6033 20.7356C26.5187 20.9398 26.3564 21.102 26.1523 21.1866C25.9991 21.25 25.805 21.25 25.4167 21.25H14.5834C14.1951 21.25 14.0009 21.25 13.8478 21.1866C13.6436 21.102 13.4814 20.9398 13.3968 20.7356C13.3334 20.5825 13.3334 20.3883 13.3334 20ZM13.3968 26.3478C13.3334 26.5009 13.3334 26.6951 13.3334 27.0834C13.3334 27.4717 13.3334 27.6658 13.3968 27.8189C13.4814 28.0231 13.6436 28.1854 13.8478 28.2699C14.0009 28.3334 14.1951 28.3334 14.5834 28.3334H25.4167C25.805 28.3334 25.9991 28.3334 26.1523 28.2699C26.3564 28.1854 26.5187 28.0231 26.6033 27.8189C26.6667 27.6658 26.6667 27.4717 26.6667 27.0834C26.6667 26.6951 26.6667 26.5009 26.6033 26.3478C26.5187 26.1436 26.3564 25.9814 26.1523 25.8968C25.9991 25.8334 25.805 25.8334 25.4167 25.8334H14.5834C14.1951 25.8334 14.0009 25.8334 13.8478 25.8968C13.6436 25.9814 13.4814 26.1436 13.3968 26.3478Z" fill="currentColor"/>
</svg>
`, x2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 36.6667H18.1047C18.2984 35.7011 18.4096 35.1778 18.5857 34.6817C18.6475 34.5076 18.7152 34.3358 18.7888 34.1667H12C11.0253 34.1667 10.4447 34.1648 10.0143 34.1296C9.75156 34.1081 9.64114 34.0798 9.61156 34.0706C9.46276 33.9922 9.34116 33.8706 9.26276 33.7218C9.25358 33.6922 9.22526 33.5818 9.2038 33.3191C9.16863 32.8887 9.16669 32.308 9.16669 31.3334V8.66671C9.16669 7.69204 9.16863 7.11138 9.2038 6.68096C9.22526 6.41827 9.25358 6.30785 9.26277 6.27825C9.34116 6.12945 9.46276 6.00785 9.61156 5.92945C9.64116 5.92027 9.75158 5.89195 10.0143 5.87049C10.4447 5.83532 11.0253 5.83337 12 5.83337H28C28.9747 5.83337 29.5553 5.83532 29.9858 5.87049C30.2485 5.89195 30.3589 5.92027 30.3885 5.92945C30.5373 6.00785 30.6589 6.12945 30.7373 6.27824C30.7465 6.30783 30.7748 6.41825 30.7962 6.68096C30.8314 7.11138 30.8334 7.69203 30.8334 8.66671V21.3353L33.3334 18.8353V8.66671C33.3334 6.79987 33.3334 5.86644 32.97 5.15341C32.6505 4.5262 32.1405 4.01626 31.5133 3.69669C30.8003 3.33337 29.8669 3.33337 28 3.33337H12C10.1332 3.33337 9.19976 3.33337 8.48672 3.69669C7.85951 4.01626 7.34958 4.5262 7.03 5.15341C6.66669 5.86644 6.66669 6.79987 6.66669 8.66671V31.3334C6.66669 33.2002 6.66669 34.1336 7.03 34.8467C7.34958 35.4739 7.85951 35.9838 8.48672 36.3034C9.19976 36.6667 10.1332 36.6667 12 36.6667ZM26.1523 25.8968C26.18 25.9083 26.207 25.9212 26.2331 25.9355L23.8353 28.3334H14.5834C14.1951 28.3334 14.0009 28.3334 13.8478 28.2699C13.6436 28.1854 13.4814 28.0231 13.3968 27.8189C13.3334 27.6658 13.3334 27.4717 13.3334 27.0834C13.3334 26.6951 13.3334 26.5009 13.3968 26.3478C13.4814 26.1436 13.6436 25.9814 13.8478 25.8968C14.0009 25.8334 14.1951 25.8334 14.5834 25.8334H25.4167C25.805 25.8334 25.9991 25.8334 26.1523 25.8968ZM9.60294 34.0676L9.60795 34.0695C9.60441 34.0683 9.60283 34.0677 9.60294 34.0676ZM9.26578 33.7305C9.26576 33.7305 9.26557 33.7301 9.26521 33.7292L9.26393 33.7255L9.26578 33.7305ZM9.26578 6.26962L9.26391 6.27467C9.26508 6.27111 9.26574 6.26953 9.26578 6.26962ZM9.60294 5.93246C9.60284 5.93243 9.60442 5.93177 9.60798 5.9306L9.60294 5.93246ZM30.3971 5.93246L30.3921 5.9306C30.3956 5.93177 30.3972 5.93243 30.3971 5.93246ZM30.7343 6.26962C30.7343 6.26952 30.735 6.27111 30.7361 6.27466L30.7343 6.26962ZM13.3334 12.9167C13.3334 12.5284 13.3334 12.3343 13.3968 12.1811C13.4814 11.9769 13.6436 11.8147 13.8478 11.7301C14.0009 11.6667 14.1951 11.6667 14.5834 11.6667H25.4167C25.805 11.6667 25.9991 11.6667 26.1523 11.7301C26.3564 11.8147 26.5187 11.9769 26.6033 12.1811C26.6667 12.3343 26.6667 12.5284 26.6667 12.9167C26.6667 13.305 26.6667 13.4991 26.6033 13.6523C26.5187 13.8565 26.3564 14.0187 26.1523 14.1033C25.9991 14.1667 25.805 14.1667 25.4167 14.1667H14.5834C14.1951 14.1667 14.0009 14.1667 13.8478 14.1033C13.6436 14.0187 13.4814 13.8565 13.3968 13.6523C13.3334 13.4991 13.3334 13.305 13.3334 12.9167ZM13.3968 19.2645C13.3334 19.4176 13.3334 19.6118 13.3334 20C13.3334 20.3883 13.3334 20.5825 13.3968 20.7356C13.4814 20.9398 13.6436 21.102 13.8478 21.1866C14.0009 21.25 14.1951 21.25 14.5834 21.25H25.4167C25.805 21.25 25.9991 21.25 26.1523 21.1866C26.3564 21.102 26.5187 20.9398 26.6033 20.7356C26.6667 20.5825 26.6667 20.3883 26.6667 20C26.6667 19.6118 26.6667 19.4176 26.6033 19.2645C26.5187 19.0603 26.3564 18.8981 26.1523 18.8135C25.9991 18.75 25.805 18.75 25.4167 18.75H14.5834C14.1951 18.75 14.0009 18.75 13.8478 18.8135C13.6436 18.8981 13.4814 19.0603 13.3968 19.2645ZM34.635 21.3453C35.031 20.9493 35.229 20.7513 35.4573 20.6771C35.6582 20.6119 35.8745 20.6119 36.0754 20.6771C36.3037 20.7513 36.5017 20.9493 36.8977 21.3453L36.992 21.4396C37.388 21.8356 37.586 22.0337 37.6602 22.262C37.7255 22.4628 37.7255 22.6792 37.6602 22.88C37.586 23.1083 37.388 23.3064 36.992 23.7024L36.0021 24.6923L33.6451 22.3352L34.635 21.3453ZM32.2309 23.7495L34.5879 26.1065L27.042 33.6524L27.0419 33.6524C26.1652 34.5292 25.7268 34.9676 25.2335 35.3294C24.7954 35.6506 24.3258 35.9264 23.8319 36.1524C23.2756 36.407 22.6792 36.5763 21.4863 36.9149L21.3837 36.9441L21.4179 36.8253C21.7582 35.6419 21.9284 35.0502 22.1826 34.4984C22.4083 34.0083 22.683 33.5424 23.0025 33.1076C23.3623 32.618 23.7977 32.1827 24.6683 31.312L32.2309 23.7495Z" fill="currentColor"/>
</svg>
`, w2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.82003 3.36331C8.19282 3.68289 7.68289 4.19282 7.36331 4.82003C7 5.53307 7 6.46649 7 8.33333V31C7 32.8668 7 33.8003 7.36331 34.5133C7.68289 35.1405 8.19282 35.6504 8.82003 35.97C9.53307 36.3333 10.4665 36.3333 12.3333 36.3333H28.3333C30.2002 36.3333 31.1336 36.3333 31.8466 35.97C32.4738 35.6504 32.9838 35.1405 33.3034 34.5133C33.6667 33.8003 33.6667 32.8668 33.6667 31V19C33.6667 13.3995 33.6667 10.5992 32.5767 8.46009C31.618 6.57847 30.0882 5.04867 28.2066 4.08993C26.0675 3 23.2672 3 17.6667 3H12.3333C10.4665 3 9.53307 3 8.82003 3.36331ZM10.3476 33.7962C10.0849 33.7748 9.97447 33.7464 9.94488 33.7373C9.79608 33.6589 9.67448 33.5373 9.59608 33.3885C9.5869 33.3589 9.55857 33.2484 9.53711 32.9857C9.50194 32.5553 9.5 31.9747 9.5 31V8.33333C9.5 7.35866 9.50194 6.77801 9.53711 6.34759C9.55857 6.08489 9.58689 5.97447 9.59608 5.94488C9.67448 5.79608 9.79608 5.67448 9.94488 5.59608C9.97447 5.58689 10.0849 5.55857 10.3476 5.53711C10.778 5.50194 11.3587 5.5 12.3333 5.5H17.6667C19.6063 5.5 21.1449 5.50091 22.4167 5.54156V9.66667L22.4167 9.71303C22.4166 10.2568 22.4166 10.738 22.4492 11.1368C22.4839 11.5615 22.5617 12.0016 22.78 12.43C23.0996 13.0572 23.6095 13.5671 24.2367 13.8867C24.6651 14.105 25.1052 14.1828 25.5299 14.2175C25.9287 14.25 26.4099 14.25 26.9537 14.25L27 14.25H31.1251C31.1658 15.5218 31.1667 17.0603 31.1667 19V31C31.1667 31.9747 31.1647 32.5553 31.1296 32.9857C31.1081 33.2484 31.0798 33.3588 31.0706 33.3885C30.9922 33.5373 30.8706 33.6589 30.7218 33.7373C30.6922 33.7464 30.5818 33.7748 30.3191 33.7962C29.8887 33.8314 29.308 33.8333 28.3333 33.8333H12.3333C11.3587 33.8333 10.778 33.8314 10.3476 33.7962ZM24.9167 5.72175C25.9057 5.85478 26.5538 6.05364 27.0716 6.31745C28.4828 7.0365 29.6302 8.18386 30.3492 9.59507C30.613 10.1128 30.8119 10.761 30.9449 11.75H27C26.396 11.75 26.0182 11.749 25.7335 11.7258C25.4634 11.7037 25.3889 11.668 25.3717 11.6592C25.2149 11.5793 25.0874 11.4518 25.0075 11.295C24.9987 11.2778 24.963 11.2033 24.9409 10.9332C24.9176 10.6485 24.9167 10.2707 24.9167 9.66667V5.72175ZM9.93625 33.7342L9.94126 33.7361C9.93772 33.7349 9.93625 33.7342 9.93625 33.7342ZM9.59909 33.3971C9.59909 33.3971 9.59841 33.3956 9.59724 33.3921L9.59909 33.3971ZM9.59909 5.93625L9.59722 5.9413C9.5984 5.93774 9.59909 5.93625 9.59909 5.93625ZM9.93625 5.59909C9.93625 5.59909 9.93774 5.5984 9.9413 5.59722L9.93625 5.59909ZM31.0676 33.3971L31.0694 33.392C31.0683 33.3956 31.0676 33.3971 31.0676 33.3971ZM30.7304 33.7342C30.7304 33.7342 30.7289 33.7349 30.7254 33.7361L30.7304 33.7342Z" fill="currentColor"/>
</svg>
`, y2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 3.33301C29.2047 3.33301 36.667 10.7953 36.667 20C36.667 25.0717 34.4002 29.6131 30.8262 32.6699C30.8278 32.6762 30.8304 32.6822 30.832 32.6885L30.793 32.6982C27.8849 35.1724 24.1173 36.667 20 36.667C10.7953 36.667 3.33302 29.2047 3.33301 20C3.33301 10.7953 10.7953 3.33301 20 3.33301ZM20 25.25C17.5668 25.25 15.8599 26.0533 14.584 27.3564C13.5213 28.4419 12.7043 29.9294 12.0703 31.7412C14.3331 33.2724 17.0621 34.167 20 34.167C22.9428 34.167 25.6754 33.2684 27.9404 31.7324C27.3371 29.9657 26.543 28.5033 25.5068 27.4248C24.2147 26.0798 22.4733 25.25 20 25.25ZM20 5.83301C12.176 5.83301 5.83301 12.176 5.83301 20C5.83301 23.9359 7.43901 27.4962 10.0303 30.0635C10.7087 28.3662 11.5989 26.832 12.7979 25.6074C14.5697 23.7978 16.9322 22.75 20 22.75C23.118 22.75 25.5217 23.8324 27.3096 25.6934C28.4675 26.8987 29.331 28.3947 29.9844 30.0488C32.567 27.4827 34.167 23.9284 34.167 20C34.167 12.176 27.824 5.83301 20 5.83301ZM20 9C23.3137 9 26 11.6863 26 15C26 18.3137 23.3137 21 20 21C16.6863 21 14 18.3137 14 15C14 11.6863 16.6863 9 20 9ZM20 11.5C18.067 11.5 16.5 13.067 16.5 15C16.5 16.933 18.067 18.5 20 18.5C21.933 18.5 23.5 16.933 23.5 15C23.5 13.067 21.933 11.5 20 11.5Z" fill="currentColor"/>
</svg>
`, _2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.3334 9.16663C32.308 9.16663 32.8887 9.16857 33.3191 9.20374C33.5818 9.2252 33.6922 9.25352 33.7218 9.26271C33.8706 9.34111 33.9922 9.46271 34.0706 9.6115C34.0798 9.6411 34.1081 9.75152 34.1296 10.0142C34.1648 10.4446 34.1667 11.0253 34.1667 12V28C34.1667 28.9746 34.1648 29.5553 34.1296 29.9857C34.1081 30.2484 34.0798 30.3588 34.0706 30.3884C33.9922 30.5372 33.8706 30.6588 33.7218 30.7372C33.6922 30.7464 33.5818 30.7747 33.3191 30.7962C32.8887 30.8313 32.308 30.8333 31.3334 30.8333H8.66671C7.69203 30.8333 7.11138 30.8313 6.68096 30.7962C6.41827 30.7747 6.30785 30.7464 6.27825 30.7372C6.12945 30.6588 6.00785 30.5372 5.92945 30.3884C5.92027 30.3588 5.89195 30.2484 5.87049 29.9857C5.83532 29.5553 5.83337 28.9746 5.83337 28V12C5.83337 11.0253 5.83532 10.4446 5.87049 10.0142C5.89195 9.75152 5.92027 9.6411 5.92945 9.6115C6.00785 9.4627 6.12945 9.3411 6.27825 9.2627C6.30784 9.25352 6.41826 9.2252 6.68096 9.20374C7.11138 9.16857 7.69203 9.16663 8.66671 9.16663H31.3334ZM33.7305 9.26572L33.7254 9.26386C33.729 9.26503 33.7306 9.26568 33.7305 9.26572ZM34.0676 9.60287C34.0677 9.60278 34.0683 9.60434 34.0695 9.60788L34.0676 9.60287ZM34.0676 30.397L34.0695 30.392C34.0683 30.3956 34.0676 30.3972 34.0676 30.397ZM33.7305 30.7342C33.7306 30.7342 33.729 30.7349 33.7255 30.736L33.7305 30.7342ZM6.26962 30.7342L6.27468 30.7361C6.27112 30.7349 6.26953 30.7342 6.26962 30.7342ZM5.93246 30.397C5.93243 30.3971 5.93177 30.3956 5.9306 30.392L5.93246 30.397ZM5.93246 9.60287L5.9306 9.60792C5.93177 9.60436 5.93243 9.60278 5.93246 9.60287ZM6.26962 9.26572C6.26953 9.26568 6.27111 9.26502 6.27467 9.26385L6.26962 9.26572ZM3.69669 8.48666C3.33337 9.1997 3.33337 10.1331 3.33337 12V28C3.33337 29.8668 3.33337 30.8002 3.69669 31.5133C4.01626 32.1405 4.5262 32.6504 5.15341 32.97C5.86644 33.3333 6.79987 33.3333 8.66671 33.3333H31.3334C33.2002 33.3333 34.1336 33.3333 34.8467 32.97C35.4739 32.6504 35.9838 32.1405 36.3034 31.5133C36.6667 30.8002 36.6667 29.8668 36.6667 28V12C36.6667 10.1331 36.6667 9.1997 36.3034 8.48666C35.9838 7.85945 35.4739 7.34952 34.8467 7.02994C34.1336 6.66663 33.2002 6.66663 31.3334 6.66663H8.66671C6.79987 6.66663 5.86644 6.66663 5.15341 7.02994C4.5262 7.34952 4.01626 7.85945 3.69669 8.48666ZM19 16.2023C19 18.3005 17.4025 20 15.4211 20C13.4398 20 11.8423 18.3092 11.8334 16.2109C11.8244 14.1647 13.4488 12.5 15.4211 12.5C17.4025 12.5 19 14.1387 19 16.2023ZM8.53679 24.0866C8.74021 23.6607 8.91908 23.5161 9.27683 23.2271C10.3319 22.3745 12.312 21.25 15.4167 21.25C18.5214 21.25 20.5015 22.3745 21.5566 23.2271C21.9143 23.5161 22.0932 23.6607 22.2966 24.0866C22.5 24.5125 22.5 24.8423 22.5 25.5019V26.6666C22.5 27.0594 22.5 27.2559 22.378 27.3779C22.256 27.4999 22.0595 27.4999 21.6667 27.4999H9.16671C8.77387 27.4999 8.57745 27.4999 8.45541 27.3779C8.33337 27.2559 8.33337 27.0594 8.33337 26.6666V25.5019C8.33337 24.8423 8.33337 24.5125 8.53679 24.0866ZM23.3968 13.4311C23.3334 13.5842 23.3334 13.7783 23.3334 14.1666C23.3334 14.5549 23.3334 14.7491 23.3968 14.9022C23.4814 15.1064 23.6436 15.2686 23.8478 15.3532C24.0009 15.4166 24.1951 15.4166 24.5834 15.4166H30.4167C30.805 15.4166 30.9991 15.4166 31.1523 15.3532C31.3565 15.2686 31.5187 15.1064 31.6033 14.9022C31.6667 14.7491 31.6667 14.5549 31.6667 14.1666C31.6667 13.7783 31.6667 13.5842 31.6033 13.4311C31.5187 13.2269 31.3565 13.0646 31.1523 12.9801C30.9991 12.9166 30.805 12.9166 30.4167 12.9166H24.5834C24.1951 12.9166 24.0009 12.9166 23.8478 12.9801C23.6436 13.0646 23.4814 13.2269 23.3968 13.4311ZM23.3334 20C23.3334 19.6117 23.3334 19.4175 23.3968 19.2644C23.4814 19.0602 23.6436 18.898 23.8478 18.8134C24.0009 18.75 24.1951 18.75 24.5834 18.75H30.4167C30.805 18.75 30.9991 18.75 31.1523 18.8134C31.3565 18.898 31.5187 19.0602 31.6033 19.2644C31.6667 19.4175 31.6667 19.6117 31.6667 20C31.6667 20.3882 31.6667 20.5824 31.6033 20.7355C31.5187 20.9397 31.3565 21.1019 31.1523 21.1865C30.9991 21.25 30.805 21.25 30.4167 21.25H24.5834C24.1951 21.25 24.0009 21.25 23.8478 21.1865C23.6436 21.1019 23.4814 20.9397 23.3968 20.7355C23.3334 20.5824 23.3334 20.3882 23.3334 20ZM25.0635 25.0977C25 25.2509 25 25.445 25 25.8333C25 26.2216 25 26.4157 25.0635 26.5689C25.1481 26.7731 25.3103 26.9353 25.5145 27.0199C25.6676 27.0833 25.8618 27.0833 26.25 27.0833H30.4167C30.805 27.0833 30.9991 27.0833 31.1523 27.0199C31.3565 26.9353 31.5187 26.7731 31.6033 26.5689C31.6667 26.4157 31.6667 26.2216 31.6667 25.8333C31.6667 25.445 31.6667 25.2509 31.6033 25.0977C31.5187 24.8935 31.3565 24.7313 31.1523 24.6467C30.9991 24.5833 30.805 24.5833 30.4167 24.5833H26.25C25.8618 24.5833 25.6676 24.5833 25.5145 24.6467C25.3103 24.7313 25.1481 24.8935 25.0635 25.0977Z" fill="currentColor"/>
</svg>
`, L2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.0779 7.33666C18.6531 5.38579 18.9406 4.41035 19.3821 4.1613C19.7633 3.94623 20.2293 3.94623 20.6105 4.1613C21.0519 4.41035 21.3395 5.38579 21.9147 7.33667L22.7175 10.0601C23.3177 12.0957 23.6178 13.1135 24.1734 13.9508C24.6653 14.692 25.3006 15.3272 26.0417 15.8191C26.879 16.3748 27.8969 16.6749 29.9325 17.275L32.6559 18.0779C34.6068 18.6531 35.5822 18.9406 35.8313 19.3821C36.0463 19.7633 36.0463 20.2293 35.8313 20.6105C35.5822 21.0519 34.6068 21.3395 32.6559 21.9147L29.9325 22.7176C27.8968 23.3177 26.879 23.6178 26.0417 24.1734C25.3006 24.6653 24.6653 25.3006 24.1734 26.0417C23.6178 26.879 23.3177 27.8969 22.7176 29.9325L21.9147 32.6559C21.3395 34.6068 21.0519 35.5822 20.6105 35.8313C20.2293 36.0463 19.7633 36.0463 19.3821 35.8313C18.9406 35.5822 18.6531 34.6068 18.0779 32.6559L17.275 29.9325C16.6749 27.8969 16.3748 26.879 15.8191 26.0417C15.3272 25.3006 14.692 24.6653 13.9508 24.1734C13.1135 23.6178 12.0957 23.3177 10.0601 22.7176L7.33666 21.9147C5.38578 21.3395 4.41035 21.0519 4.1613 20.6105C3.94623 20.2293 3.94623 19.7633 4.1613 19.3821C4.41035 18.9406 5.38578 18.6531 7.33665 18.0779L10.0601 17.275C12.0957 16.6749 13.1135 16.3748 13.9508 15.8191C14.692 15.3272 15.3272 14.692 15.8191 13.9508C16.3748 13.1135 16.6749 12.0957 17.275 10.0601L18.0779 7.33666ZM19.9963 9.67038L20.4094 11.0722C20.9201 12.8092 21.3216 14.1747 22.0904 15.3333C22.7668 16.3524 23.6402 17.2258 24.6593 17.9021C25.8178 18.671 27.1833 19.0725 28.9204 19.5832L30.3222 19.9963L28.9204 20.4094C27.1833 20.9201 25.8178 21.3216 24.6593 22.0904C23.6402 22.7668 22.7668 23.6402 22.0904 24.6593C21.3216 25.8178 20.9201 27.1833 20.4094 28.9204L19.9963 30.3222L19.5832 28.9204C19.0725 27.1833 18.671 25.8178 17.9021 24.6593C17.2258 23.6402 16.3524 22.7668 15.3333 22.0904C14.1747 21.3216 12.8092 20.9201 11.0722 20.4094L9.67038 19.9963L11.0722 19.5832C12.8092 19.0725 14.1747 18.671 15.3333 17.9021C16.3524 17.2258 17.2258 16.3524 17.9021 15.3333C18.671 14.1747 19.0725 12.8092 19.5832 11.0722L19.9963 9.67038Z" fill="currentColor"/>
</svg>
`, S2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.43791 2.20311L6.6567 4.85296C6.50666 5.36187 6.43165 5.61633 6.29273 5.82565C6.16976 6.01095 6.01095 6.16976 5.82565 6.29273C5.61633 6.43165 5.36187 6.50667 4.85296 6.6567L2.20311 7.43791C1.2927 7.70631 0.837491 7.84052 0.721269 8.04653C0.620905 8.22443 0.620905 8.44187 0.721269 8.61977C0.837492 8.82579 1.2927 8.95999 2.2031 9.22839L4.85296 10.0096C5.36186 10.1596 5.61633 10.2347 5.82565 10.3736C6.01095 10.4965 6.16976 10.6554 6.29273 10.8407C6.43165 11.05 6.50666 11.3044 6.6567 11.8133L7.43791 14.4632C7.70631 15.3736 7.84052 15.8288 8.04653 15.945C8.22443 16.0454 8.44187 16.0454 8.61977 15.945C8.82579 15.8288 8.95999 15.3736 9.22839 14.4632L10.0096 11.8133C10.1596 11.3044 10.2347 11.05 10.3736 10.8407C10.4965 10.6554 10.6554 10.4965 10.8406 10.3736C11.05 10.2347 11.3044 10.1596 11.8133 10.0096L14.4632 9.22839C15.3736 8.95999 15.8288 8.82579 15.945 8.61977C16.0454 8.44187 16.0454 8.22443 15.945 8.04653C15.8288 7.84052 15.3736 7.70632 14.4632 7.43791L11.8133 6.6567C11.3044 6.50667 11.05 6.43165 10.8406 6.29273C10.6554 6.16976 10.4965 6.01095 10.3736 5.82565C10.2347 5.61633 10.1596 5.36188 10.0096 4.85297L9.22839 2.20311C8.95999 1.2927 8.82579 0.837492 8.61977 0.721269C8.44187 0.620905 8.22443 0.620905 8.04653 0.721269C7.84052 0.837491 7.70631 1.2927 7.43791 2.20311Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.7481 8.17353C20.3233 6.22265 20.6108 5.24721 21.0523 4.99816C21.4335 4.7831 21.8995 4.7831 22.2807 4.99816C22.7221 5.24721 23.0097 6.22265 23.5849 8.17353L24.3877 10.8969C24.9879 12.9326 25.288 13.9504 25.8436 14.7877C26.3355 15.5289 26.9708 16.1641 27.7119 16.656C28.5492 17.2117 29.5671 17.5118 31.6027 18.1119L34.3261 18.9148C36.277 19.4899 37.2524 19.7775 37.5015 20.219C37.7165 20.6002 37.7165 21.0661 37.5015 21.4473C37.2524 21.8888 36.277 22.1764 34.3261 22.7515L31.6027 23.5544C29.567 24.1546 28.5492 24.4546 27.7119 25.0103C26.9708 25.5022 26.3355 26.1374 25.8436 26.8786C25.288 27.7159 24.9879 28.7337 24.3878 30.7693L23.5849 33.4928C23.0097 35.4436 22.7221 36.4191 22.2807 36.6681C21.8995 36.8832 21.4335 36.8832 21.0523 36.6681C20.6108 36.4191 20.3233 35.4436 19.7481 33.4928L18.9452 30.7694C18.3451 28.7337 18.045 27.7159 17.4893 26.8786C16.9974 26.1374 16.3622 25.5022 15.621 25.0103C14.7837 24.4546 13.7659 24.1546 11.7303 23.5544L9.00686 22.7515C7.05598 22.1764 6.08055 21.8888 5.8315 21.4473C5.61643 21.0661 5.61643 20.6002 5.8315 20.219C6.08055 19.7775 7.05598 19.4899 9.00685 18.9148L11.7303 18.1119C13.7659 17.5118 14.7837 17.2117 15.621 16.656C16.3622 16.1641 16.9974 15.5289 17.4893 14.7877C18.045 13.9504 18.3451 12.9326 18.9452 10.8969L19.7481 8.17353ZM21.6665 10.5072L22.0796 11.909C22.5903 13.6461 22.9918 15.0116 23.7606 16.1701C24.437 17.1892 25.3104 18.0627 26.3295 18.739C27.488 19.5079 28.8535 19.9093 30.5906 20.42L31.9924 20.8332L30.5906 21.2463C28.8535 21.757 27.488 22.1584 26.3295 22.9273C25.3104 23.6036 24.437 24.4771 23.7606 25.4962C22.9918 26.6547 22.5903 28.0202 22.0796 29.7573L21.6665 31.1591L21.2534 29.7572C20.7427 28.0202 20.3412 26.6547 19.5723 25.4962C18.896 24.4771 18.0226 23.6036 17.0034 22.9273C15.8449 22.1584 14.4794 21.757 12.7424 21.2463L11.3406 20.8332L12.7424 20.42C14.4794 19.9093 15.8449 19.5079 17.0034 18.739C18.0226 18.0627 18.896 17.1892 19.5723 16.1701C20.3412 15.0116 20.7427 13.6461 21.2534 11.9091L21.6665 10.5072Z" fill="currentColor"/>
</svg>
`, M2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.66665 8.33313H33.3333C33.7935 8.33313 34.1666 8.70623 34.1666 9.16646V30.8331C34.1666 31.2934 33.7935 31.6665 33.3333 31.6665H6.66665C6.20641 31.6665 5.83331 31.2934 5.83331 30.8331V9.16646C5.83331 8.70623 6.20641 8.33313 6.66665 8.33313ZM3.33331 9.16646C3.33331 7.32551 4.8257 5.83313 6.66665 5.83313L33.3333 5.83313C35.1743 5.83313 36.6666 7.32551 36.6666 9.16646V30.8331C36.6666 32.6741 35.1743 34.1665 33.3333 34.1665H6.66665C4.8257 34.1665 3.33331 32.6741 3.33331 30.8331V9.16646Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.3265 14.9049C14.0475 14.6259 13.5953 14.6259 13.3163 14.9049L9.41067 18.8105C8.59708 19.6241 8.59708 20.9432 9.41067 21.7568L13.3163 25.6625C13.5953 25.9414 14.0475 25.9414 14.3265 25.6625L15.0841 24.9049C15.3631 24.6259 15.363 24.1737 15.0841 23.8947L11.4731 20.2837L15.0841 16.6726C15.363 16.3937 15.3631 15.9414 15.0841 15.6625L14.3265 14.9049ZM30.8333 18.8105L26.0907 14.8216C25.807 14.583 25.3879 14.601 25.1258 14.8631L24.3806 15.6084C24.0814 15.9076 24.1064 16.3998 24.4344 16.6671L28.872 20.2837L24.4344 23.9002C24.1064 24.1675 24.0814 24.6598 24.3806 24.959L25.1258 25.7042C25.3879 25.9663 25.807 25.9844 26.0907 25.7458L30.8333 21.7568C31.6469 20.9432 31.6469 19.6241 30.8333 18.8105ZM20.4664 13.8141L17.1331 26.1676H19.5369L22.8702 13.8141H20.4664Z" fill="currentColor"/>
<path d="M6.66665 8.33313C6.20641 8.33313 5.83331 8.70623 5.83331 9.16646V30.8331C5.83331 31.2934 6.20641 31.6665 6.66665 31.6665H33.3333C33.7935 31.6665 34.1666 31.2934 34.1666 30.8331V9.16646C34.1666 8.70623 33.7935 8.33313 33.3333 8.33313H6.66665ZM3.33331 9.16646C3.33331 7.32551 4.8257 5.83313 6.66665 5.83313L33.3333 5.83313C35.1743 5.83313 36.6666 7.32551 36.6666 9.16646V30.8331C36.6666 32.6741 35.1743 34.1665 33.3333 34.1665H6.66665C4.8257 34.1665 3.33331 32.6741 3.33331 30.8331V9.16646Z" fill="currentColor"/>
<path d="M14.6632 15.2416C14.1983 14.7767 13.4445 14.7767 12.9796 15.2416L9.41063 18.8105C8.59704 19.6241 8.59704 20.9432 9.41063 21.7568L12.9796 25.3258C13.4445 25.7907 14.1983 25.7907 14.6632 25.3258L14.7473 25.2416C15.2123 24.7767 15.2123 24.0229 14.7473 23.558L11.473 20.2837L14.7473 17.0093C15.2123 16.5444 15.2123 15.7907 14.7473 15.3258L14.6632 15.2416ZM30.8332 18.8105L26.425 15.1028C25.9522 14.7051 25.2537 14.7352 24.8169 15.1721L24.7533 15.2356C24.2547 15.7343 24.2964 16.5547 24.8431 17.0002L28.8719 20.2837L24.8431 23.5671C24.2964 24.0127 24.2547 24.8331 24.7533 25.3318L24.8169 25.3953C25.2537 25.8321 25.9522 25.8622 26.425 25.4646L30.8332 21.7568C31.6468 20.9432 31.6468 19.6241 30.8332 18.8105ZM20.4664 13.8141L17.133 26.1676H19.5369L22.8702 13.8141H20.4664Z" fill="currentColor"/>
</svg>
`, H2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.66671 9.16663C7.69203 9.16663 7.11138 9.16857 6.68096 9.20374C6.41826 9.2252 6.30784 9.25352 6.27825 9.2627C6.12945 9.3411 6.00785 9.4627 5.92945 9.6115C5.92027 9.6411 5.89195 9.75152 5.87049 10.0142C5.83532 10.4446 5.83337 11.0253 5.83337 12V24.0311L10.7242 18.4391L11.6648 17.3637L12.6057 18.4389L16.176 22.5185L23.6265 14.7757L24.5367 13.8297L25.437 14.7852L34.1667 24.0501V12C34.1667 11.0253 34.1648 10.4446 34.1296 10.0142C34.1081 9.75152 34.0798 9.6411 34.0706 9.6115C33.9922 9.46271 33.8706 9.34111 33.7218 9.26271C33.6922 9.25352 33.5818 9.2252 33.3191 9.20374C32.8887 9.16857 32.308 9.16663 31.3334 9.16663H8.66671ZM5.83337 27.8009V28C5.83337 28.9746 5.83532 29.5553 5.87049 29.9857C5.89195 30.2484 5.92027 30.3588 5.92945 30.3884C6.00785 30.5372 6.12945 30.6588 6.27825 30.7372C6.30785 30.7464 6.41827 30.7747 6.68096 30.7962C7.11138 30.8313 7.69203 30.8333 8.66671 30.8333H31.3334C32.308 30.8333 32.8887 30.8313 33.3191 30.7962C33.5818 30.7747 33.6922 30.7464 33.7218 30.7372C33.8706 30.6588 33.9922 30.5372 34.0706 30.3884C34.0798 30.3588 34.1081 30.2484 34.1296 29.9857C34.1648 29.5553 34.1667 28.9746 34.1667 28V27.6316L32.6045 26.0373L32.596 26.0286L32.5876 26.0197L24.5177 17.455L17.033 25.2334L16.0886 26.2148L15.1916 25.1898L11.6653 21.1605L7.48928 25.9352L7.48327 25.9421L7.48324 25.9421L5.83337 27.8009ZM33.7305 9.26572L33.7254 9.26386C33.729 9.26503 33.7306 9.26568 33.7305 9.26572ZM34.0676 9.60287C34.0677 9.60278 34.0683 9.60434 34.0695 9.60788L34.0676 9.60287ZM34.0676 30.397L34.0695 30.392C34.0683 30.3956 34.0676 30.3972 34.0676 30.397ZM33.7305 30.7342C33.7306 30.7342 33.729 30.7349 33.7255 30.736L33.7305 30.7342ZM6.26962 30.7342L6.27468 30.7361C6.27112 30.7349 6.26953 30.7342 6.26962 30.7342ZM5.93246 30.397C5.93243 30.3971 5.93177 30.3956 5.9306 30.392L5.93246 30.397ZM5.93246 9.60287L5.9306 9.60792C5.93177 9.60436 5.93243 9.60278 5.93246 9.60287ZM6.26962 9.26572C6.26953 9.26568 6.27111 9.26502 6.27467 9.26385L6.26962 9.26572ZM3.33337 12C3.33337 10.1331 3.33337 9.1997 3.69669 8.48666C4.01626 7.85945 4.5262 7.34952 5.15341 7.02994C5.86644 6.66663 6.79987 6.66663 8.66671 6.66663H31.3334C33.2002 6.66663 34.1336 6.66663 34.8467 7.02994C35.4739 7.34952 35.9838 7.85945 36.3034 8.48666C36.6667 9.1997 36.6667 10.1331 36.6667 12V28C36.6667 29.8668 36.6667 30.8002 36.3034 31.5133C35.9838 32.1405 35.4739 32.6504 34.8467 32.97C34.1336 33.3333 33.2002 33.3333 31.3334 33.3333H8.66671C6.79987 33.3333 5.86644 33.3333 5.15341 32.97C4.5262 32.6504 4.01626 32.1405 3.69669 31.5133C3.33337 30.8002 3.33337 29.8668 3.33337 28V12Z" fill="currentColor"/>
</svg>
`, k2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.3333 7.5H29.6667C30.6413 7.5 31.222 7.50194 31.6524 7.53711C31.9151 7.55857 32.0255 7.5869 32.0551 7.59608C32.2039 7.67448 32.3255 7.79608 32.4039 7.94488C32.4131 7.97448 32.4414 8.0849 32.4629 8.34759C32.4981 8.77801 32.5 9.35866 32.5 10.3333V29.6667C32.5 30.6413 32.4981 31.222 32.4629 31.6524C32.4414 31.9151 32.4131 32.0255 32.4039 32.0551C32.3255 32.2039 32.2039 32.3255 32.0551 32.4039C32.0255 32.4131 31.9151 32.4414 31.6524 32.4629C31.222 32.4981 30.6413 32.5 29.6667 32.5H10.3333C9.35866 32.5 8.77801 32.4981 8.34759 32.4629C8.0849 32.4414 7.97448 32.4131 7.94488 32.4039C7.79608 32.3255 7.67448 32.2039 7.59608 32.0551C7.5869 32.0255 7.55857 31.9151 7.53711 31.6524C7.50194 31.222 7.5 30.6413 7.5 29.6667V10.3333C7.5 9.35866 7.50194 8.77801 7.53711 8.34759C7.55857 8.08489 7.58689 7.97447 7.59608 7.94488C7.67448 7.79608 7.79608 7.67448 7.94488 7.59608C7.97447 7.58689 8.08489 7.55857 8.34759 7.53711C8.77801 7.50194 9.35866 7.5 10.3333 7.5ZM32.0638 7.59909L32.0587 7.59723C32.0623 7.5984 32.0638 7.59909 32.0638 7.59909ZM32.4009 7.93625C32.4009 7.93625 32.4016 7.93771 32.4028 7.94124L32.4009 7.93625ZM32.4009 32.0637L32.4028 32.0588C32.4016 32.0623 32.4009 32.0637 32.4009 32.0637ZM32.0638 32.4009C32.0638 32.4009 32.0623 32.4016 32.0587 32.4028L32.0638 32.4009ZM7.94127 32.4028L7.93625 32.4009L7.93784 32.4016L7.94127 32.4028ZM7.59909 32.0638C7.59909 32.0638 7.59841 32.0623 7.59724 32.0588L7.59909 32.0638ZM7.59909 7.93625L7.59722 7.9413C7.5984 7.93774 7.59909 7.93625 7.59909 7.93625ZM7.93625 7.59909C7.93625 7.59909 7.93774 7.5984 7.9413 7.59722L7.93625 7.59909ZM5 10.3333C5 8.46649 5 7.53307 5.36331 6.82003C5.68289 6.19282 6.19282 5.68289 6.82003 5.36331C7.53307 5 8.46649 5 10.3333 5H29.6667C31.5335 5 32.4669 5 33.18 5.36331C33.8072 5.68289 34.3171 6.19282 34.6367 6.82003C35 7.53307 35 8.46649 35 10.3333V29.6667C35 31.5335 35 32.4669 34.6367 33.18C34.3171 33.8072 33.8072 34.3171 33.18 34.6367C32.4669 35 31.5335 35 29.6667 35H10.3333C8.46649 35 7.53307 35 6.82003 34.6367C6.19282 34.3171 5.68289 33.8072 5.36331 33.18C5 32.4669 5 31.5335 5 29.6667V10.3333ZM10 15.4167C10 15.0284 10 14.8342 10.0634 14.6811C10.148 14.4769 10.3102 14.3147 10.5144 14.2301C10.6676 14.1667 10.8617 14.1667 11.25 14.1667H28.75C29.1383 14.1667 29.3324 14.1667 29.4856 14.2301C29.6898 14.3147 29.852 14.4769 29.9366 14.6811C30 14.8342 30 15.0284 30 15.4167C30 15.805 30 15.9991 29.9366 16.1522C29.852 16.3564 29.6898 16.5187 29.4856 16.6032C29.3324 16.6667 29.1383 16.6667 28.75 16.6667H11.25C10.8617 16.6667 10.6676 16.6667 10.5144 16.6032C10.3102 16.5187 10.148 16.3564 10.0634 16.1522C10 15.9991 10 15.805 10 15.4167ZM10.0634 21.3478C10 21.5009 10 21.695 10 22.0833C10 22.4716 10 22.6658 10.0634 22.8189C10.148 23.0231 10.3102 23.1853 10.5144 23.2699C10.6676 23.3333 10.8617 23.3333 11.25 23.3333H22.0833C22.4716 23.3333 22.6658 23.3333 22.8189 23.2699C23.0231 23.1853 23.1853 23.0231 23.2699 22.8189C23.3333 22.6658 23.3333 22.4716 23.3333 22.0833C23.3333 21.695 23.3333 21.5009 23.2699 21.3478C23.1853 21.1436 23.0231 20.9813 22.8189 20.8968C22.6658 20.8333 22.4716 20.8333 22.0833 20.8333H11.25C10.8617 20.8333 10.6676 20.8333 10.5144 20.8968C10.3102 20.9813 10.148 21.1436 10.0634 21.3478Z" fill="currentColor"/>
</svg>
`, z2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23 7.5C23.9747 7.5 24.5554 7.50194 24.9858 7.53711C25.2485 7.55857 25.3589 7.5869 25.3885 7.59608C25.5373 7.67448 25.6589 7.79608 25.7373 7.94488C25.7465 7.97448 25.7748 8.0849 25.7963 8.34759C25.8272 8.72651 25.8324 9.22187 25.8332 10H14.1668C14.1676 9.22187 14.1729 8.72651 14.2038 8.34759C14.2253 8.08489 14.2536 7.97447 14.2628 7.94488C14.3412 7.79608 14.4628 7.67448 14.6116 7.59608C14.6412 7.5869 14.7516 7.55857 15.0143 7.53711C15.4447 7.50194 16.0254 7.5 17 7.5H23ZM28.3333 10C28.332 8.35275 28.3111 7.48931 27.9701 6.82003C27.6505 6.19282 27.1405 5.68289 26.5133 5.36331C25.8003 5 24.8669 5 23 5H17C15.1332 5 14.1998 5 13.4867 5.36331C12.8595 5.68289 12.3496 6.19282 12.03 6.82003C11.689 7.48931 11.6681 8.35275 11.6668 10H8.66671C6.79987 10 5.86644 10 5.15341 10.3633C4.5262 10.6829 4.01626 11.1928 3.69669 11.82C3.41172 12.3793 3.35027 13.0742 3.33702 14.2487L3.33337 14.2472V15.3333V16.9358V28C3.33337 29.8668 3.33337 30.8003 3.69669 31.5133C4.01626 32.1405 4.5262 32.6504 5.15341 32.97C5.86644 33.3333 6.79987 33.3333 8.66671 33.3333H31.3334C33.2002 33.3333 34.1336 33.3333 34.8467 32.97C35.4739 32.6504 35.9838 32.1405 36.3034 31.5133C36.6667 30.8003 36.6667 29.8668 36.6667 28V16.9358V15.3333V14.2472L36.6631 14.2487C36.6498 13.0742 36.5884 12.3793 36.3034 11.82C35.9838 11.1928 35.4739 10.6829 34.8467 10.3633C34.1336 10 33.2002 10 31.3334 10H28.3333ZM5.83337 28V17.8109C8.77495 18.747 11.8431 19.3994 15.0055 19.7359C15.0178 20.2141 15.0578 20.5183 15.1877 20.7683C15.3458 21.0727 15.594 21.3209 15.8984 21.479C16.2596 21.6667 16.7342 21.6667 17.6834 21.6667H22.3167C23.2659 21.6667 23.7404 21.6667 24.1017 21.479C24.4061 21.3209 24.6543 21.0727 24.8124 20.7683C24.9422 20.5183 24.9822 20.2141 24.9946 19.7359C28.157 19.3994 31.2251 18.747 34.1667 17.8109V28C34.1667 28.9747 34.1648 29.5553 34.1296 29.9857C34.1081 30.2484 34.0798 30.3588 34.0706 30.3885C33.9922 30.5373 33.8706 30.6589 33.7218 30.7373C33.6922 30.7464 33.5818 30.7748 33.3191 30.7962C32.8887 30.8314 32.308 30.8333 31.3334 30.8333H8.66671C7.69203 30.8333 7.11138 30.8314 6.68096 30.7962C6.41827 30.7748 6.30785 30.7464 6.27825 30.7373C6.12945 30.6589 6.00785 30.5373 5.92945 30.3885C5.92027 30.3589 5.89195 30.2484 5.87049 29.9857C5.83532 29.5553 5.83337 28.9747 5.83337 28ZM20 17.5C15.0449 17.5 10.2803 16.684 5.8334 15.179C5.83368 14.2965 5.83721 13.7548 5.87049 13.3476C5.89195 13.0849 5.92027 12.9745 5.92945 12.9449C6.00785 12.7961 6.12945 12.6745 6.27825 12.5961C6.30784 12.5869 6.41826 12.5586 6.68096 12.5371C7.11138 12.5019 7.69203 12.5 8.66671 12.5H31.3334C32.308 12.5 32.8887 12.5019 33.3191 12.5371C33.5818 12.5586 33.6922 12.5869 33.7218 12.5961C33.8706 12.6745 33.9922 12.7961 34.0706 12.9449C34.0798 12.9745 34.1081 13.0849 34.1296 13.3476C34.1629 13.7548 34.1664 14.2965 34.1667 15.179C29.7198 16.684 24.9552 17.5 20 17.5ZM25.3971 7.59909L25.3921 7.59722C25.3956 7.5984 25.3972 7.59905 25.3971 7.59909ZM25.7343 7.93625C25.7343 7.93615 25.735 7.93774 25.7362 7.9413L25.7343 7.93625ZM14.2658 7.93625L14.2639 7.9413C14.2651 7.93774 14.2658 7.93615 14.2658 7.93625ZM14.6032 7.59897C14.603 7.59904 14.6029 7.59908 14.603 7.59909L14.608 7.59722L14.6038 7.5987C14.6035 7.59881 14.6033 7.5989 14.6032 7.59897ZM33.7305 12.5991L33.7254 12.5972C33.729 12.5984 33.7306 12.5991 33.7305 12.5991ZM34.0681 12.9373C34.0678 12.9365 34.0676 12.9362 34.0676 12.9362L34.0695 12.9413L34.0681 12.9373ZM34.0676 30.3971L34.0695 30.392C34.0683 30.3956 34.0677 30.3972 34.0676 30.3971ZM33.7305 30.7342C33.7305 30.7343 33.729 30.7349 33.7255 30.7361L33.7305 30.7342ZM6.26962 30.7342L6.27467 30.7361C6.27111 30.7349 6.26953 30.7343 6.26962 30.7342ZM5.93239 30.397C5.93243 30.3971 5.93246 30.3971 5.93246 30.3971L5.93221 30.3966C5.93229 30.3968 5.93235 30.3969 5.93239 30.397ZM5.93246 12.9362L5.9306 12.9413C5.93177 12.9377 5.93243 12.9362 5.93246 12.9362ZM6.26962 12.5991C6.26953 12.5991 6.27111 12.5984 6.27467 12.5972L6.26962 12.5991Z" fill="currentColor"/>
</svg>
`, A2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.1028 25.8223C15.3758 25.9578 16.8976 27.4381 17.6692 28.4268C18.0501 28.7421 18.3081 29.1836 18.385 29.7217C18.467 30.2959 18.3309 30.8865 18.1213 31.4414C17.7003 32.5559 16.7734 34.0511 15.2649 36.0625L13.2649 34.5625C13.8854 33.7351 14.3742 33.033 14.7561 32.4424C14.1667 32.6689 13.5029 32.8124 12.7649 32.8125L12.426 32.8027C9.00031 32.5979 7.27967 29.3406 7.26489 29.3125C7.28015 29.2835 9.11376 25.8127 12.7649 25.8125L13.1028 25.8223ZM26.969 25.8125C30.6353 25.8129 32.469 29.3125 32.469 29.3125C32.469 29.3125 30.7482 32.5968 27.3079 32.8027L26.969 32.8125C26.2309 32.8125 25.5673 32.6689 24.9778 32.4424C25.3597 33.0331 25.8484 33.735 26.469 34.5625L24.469 36.0625C22.9604 34.0511 22.0336 32.5559 21.6125 31.4414C21.4029 30.8865 21.2668 30.2959 21.3489 29.7217C21.4258 29.1835 21.6836 28.7421 22.0647 28.4268C22.8364 27.438 24.358 25.9577 26.6311 25.8223L26.969 25.8125ZM12.7649 28.3125C11.8193 28.3126 11.0516 28.7396 10.4309 29.3125C11.0516 29.8854 11.8193 30.3124 12.7649 30.3125C13.7102 30.3124 14.4773 29.8852 15.0979 29.3125C14.4773 28.7398 13.7102 28.3126 12.7649 28.3125ZM26.969 28.3125C26.0236 28.3125 25.2566 28.7398 24.636 29.3125C25.2566 29.8852 26.0236 30.3125 26.969 30.3125C27.9146 30.3123 28.6823 29.8855 29.303 29.3125C28.6823 28.7395 27.9146 28.3127 26.969 28.3125ZM4.0022 17.5625C4.04411 17.5361 7.35968 15.4598 10.5149 17.2812L10.803 17.459C13.6767 19.3549 13.5289 23.0531 13.5286 23.0625L13.3792 23.1494C12.6969 23.529 9.79329 24.9476 7.01489 23.3438L6.72681 23.166C3.85477 21.2709 4.00168 17.5753 4.0022 17.5625ZM29.219 17.2812C32.3851 15.4537 35.7124 17.5503 35.7317 17.5625C35.7323 17.5771 35.8782 21.2713 33.0071 23.166L32.719 23.3438C29.9408 24.9478 27.0374 23.5292 26.3547 23.1494L26.2053 23.0625C26.2053 23.0625 26.0532 19.3573 28.9309 17.459L29.219 17.2812ZM9.26489 19.4463C8.44614 18.9737 7.56821 18.9598 6.74438 19.1455C6.99548 19.9521 7.44595 20.7058 8.26489 21.1787C9.08365 21.6513 9.96158 21.6642 10.7854 21.4785C10.5343 20.6724 10.0834 19.919 9.26489 19.4463ZM32.9895 19.1455C32.1656 18.9598 31.2878 18.9737 30.469 19.4463C29.6503 19.919 29.1997 20.6723 28.9485 21.4785C29.7723 21.6642 30.6502 21.6514 31.469 21.1787C32.2879 20.7058 32.7384 19.952 32.9895 19.1455ZM14.1887 6C14.2235 6.03216 17.0889 8.69852 16.1458 12.2188L16.0491 12.542C14.9693 15.7861 11.4007 16.6116 11.342 16.625L11.219 16.5029C10.6757 15.9422 8.55366 13.5053 9.38403 10.4062L9.48169 10.082C10.5687 6.81824 14.1746 6.00319 14.1887 6ZM25.5452 6C25.5819 6.00833 29.1687 6.82849 30.2522 10.082L30.3499 10.4062C31.1801 13.505 29.0584 15.9419 28.5149 16.5029L28.3918 16.625C28.3534 16.6163 24.7677 15.7955 23.6848 12.542L23.5881 12.2188C22.642 8.68771 25.5277 6.01609 25.5452 6ZM13.3694 9.05762C12.6552 9.50893 12.0439 10.1402 11.7991 11.0537C11.5544 11.967 11.7687 12.8186 12.1614 13.5664C12.8752 13.1151 13.486 12.4844 13.7307 11.5713C13.9754 10.6578 13.7622 9.80552 13.3694 9.05762ZM26.3645 9.05762C25.9716 9.80559 25.7584 10.6577 26.0032 11.5713C26.2479 12.4845 26.8586 13.1151 27.5725 13.5664C27.9651 12.8187 28.1794 11.9669 27.9348 11.0537C27.69 10.1402 27.0787 9.50894 26.3645 9.05762Z" fill="currentColor"/>
</svg>
`, V2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.62 36.4022C4.72909 36.4113 4.84182 36.4022 4.95636 36.375L27.1618 31.015C27.3607 30.9669 27.5417 30.863 27.6834 30.7154C27.8252 30.5679 27.9218 30.3829 27.9618 30.1822L29.8655 20.6622L29.9818 20.775C30.183 20.9759 30.4557 21.0888 30.74 21.0888C31.0243 21.0888 31.297 20.9759 31.4982 20.775L36.0927 16.1804C36.2931 15.9793 36.4057 15.707 36.4057 15.4231C36.4057 15.1393 36.2931 14.8669 36.0927 14.6659L25.3709 3.94405C25.1698 3.74364 24.8975 3.63111 24.6136 3.63111C24.3297 3.63111 24.0574 3.74364 23.8564 3.94405L19.2618 8.53859C19.0609 8.73974 18.948 9.01244 18.948 9.29678C18.948 9.58111 19.0609 9.85381 19.2618 10.055L19.3745 10.1713L9.85455 12.0731C9.68362 12.1073 9.52359 12.1826 9.38832 12.2926C9.25304 12.4025 9.14659 12.5437 9.07818 12.704L9.02364 12.8731L3.66 35.0804C3.63437 35.1912 3.62639 35.3053 3.63636 35.4186V35.4459C3.6401 35.4912 3.64739 35.5362 3.65818 35.5804L3.67273 35.6313C3.68232 35.6685 3.69447 35.7049 3.70909 35.7404L3.73455 35.795C3.75597 35.841 3.78089 35.8854 3.80909 35.9277L3.82 35.9422L3.84727 35.9786C3.95105 36.1153 4.0856 36.2255 4.24 36.3004C4.29236 36.3264 4.34718 36.3471 4.40364 36.3622L4.45636 36.3768C4.49992 36.3881 4.5443 36.396 4.58909 36.4004H4.61273L4.62 36.4022ZM30.74 18.5022L21.5345 9.29678L24.6145 6.21859L33.8182 15.4222L30.74 18.5022ZM8.15455 33.3986L16.42 25.1313C17.2887 25.6326 18.3101 25.8011 19.2938 25.6052C20.2775 25.4094 21.1564 24.8627 21.7669 24.0669C22.3774 23.2711 22.6778 22.2805 22.6122 21.2796C22.5465 20.2788 22.1193 19.3359 21.4101 18.6267C20.7009 17.9175 19.758 17.4902 18.7571 17.4246C17.7563 17.3589 16.7657 17.6593 15.9699 18.2698C15.1741 18.8803 14.6274 19.7593 14.4315 20.743C14.2357 21.7267 14.4041 22.748 14.9055 23.6168L6.63818 31.8822L10.9473 14.0422L21.1982 11.9931L28.0436 18.8386L25.9945 29.0913L8.15455 33.3986ZM18.4873 23.5404C17.9593 23.5404 17.4529 23.3307 17.0795 22.9573C16.7061 22.5839 16.4964 22.0775 16.4964 21.5495C16.4964 21.0215 16.7061 20.5151 17.0795 20.1417C17.4529 19.7684 17.9593 19.5586 18.4873 19.5586C19.0153 19.5586 19.5217 19.7684 19.8951 20.1417C20.2684 20.5151 20.4782 21.0215 20.4782 21.5495C20.4782 22.0775 20.2684 22.5839 19.8951 22.9573C19.5217 23.3307 19.0153 23.5404 18.4873 23.5404Z" fill="currentColor"/>
</svg>
`, $2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.6683 5.68868C28.2878 5.81232 27.9578 6.14234 27.2977 6.80237L25.6478 8.45228L31.5404 14.3448L33.1903 12.6949C33.8503 12.0349 34.1803 11.7049 34.304 11.3243C34.4127 10.9896 34.4127 10.629 34.304 10.2943C34.1803 9.91373 33.8503 9.58371 33.1903 8.92369L31.069 6.80237C30.4089 6.14234 30.0789 5.81232 29.6984 5.68868C29.3636 5.57991 29.0031 5.57991 28.6683 5.68868ZM6.20242 33.7903C7.36423 33.6847 8.11758 33.6162 8.73693 33.5258C8.99841 33.4877 9.236 33.4457 9.47036 33.3953C11.4463 32.9708 13.2998 32.1026 14.8909 30.8565C15.5266 30.3586 16.1132 29.772 17.2864 28.5988L27.4156 18.4696L29.1833 16.7019L27.4156 14.9341L25.0586 12.5771L23.2908 10.8093L21.523 12.5771L11.3939 22.7062C10.2207 23.8794 9.63408 24.466 9.13618 25.1017C7.89002 26.6928 7.02186 28.5464 6.59732 30.5223C6.54697 30.7567 6.50494 30.9942 6.46681 31.2557C6.37649 31.875 6.30801 32.6284 6.20239 33.7901L6.20238 33.7902L6.20238 33.7903L6.20242 33.7903ZM13.3494 28.8883C12.0899 29.8748 10.628 30.5697 9.06887 30.9238C9.42296 29.3647 10.1179 27.9028 11.1044 26.6432C11.4873 26.1543 11.9463 25.6893 13.1616 24.474L23.2908 14.3448L25.6478 16.7019L15.5187 26.831C14.3034 28.0463 13.8384 28.5053 13.3494 28.8883Z" fill="currentColor"/>
<path d="M5 7.91667C5 8.30495 5 8.49909 5.06343 8.65224C5.14801 8.85643 5.31024 9.01865 5.51443 9.10323C5.66757 9.16667 5.86172 9.16667 6.25 9.16667H17.0833C17.4716 9.16667 17.6658 9.16667 17.8189 9.10323C18.0231 9.01865 18.1853 8.85643 18.2699 8.65224C18.3333 8.49909 18.3333 8.30495 18.3333 7.91667C18.3333 7.52838 18.3333 7.33424 18.2699 7.1811C18.1853 6.97691 18.0231 6.81468 17.8189 6.7301C17.6658 6.66667 17.4716 6.66667 17.0833 6.66667H6.25C5.86172 6.66667 5.66757 6.66667 5.51443 6.7301C5.31024 6.81468 5.14801 6.97691 5.06343 7.1811C5 7.33424 5 7.52838 5 7.91667Z" fill="currentColor"/>
<path d="M5.06343 15.7356C5 15.5824 5 15.3883 5 15C5 14.6117 5 14.4176 5.06343 14.2644C5.14801 14.0602 5.31024 13.898 5.51443 13.8134C5.66757 13.75 5.86172 13.75 6.25 13.75H10.4167C10.805 13.75 10.9991 13.75 11.1522 13.8134C11.3564 13.898 11.5187 14.0602 11.6032 14.2644C11.6667 14.4176 11.6667 14.6117 11.6667 15C11.6667 15.3883 11.6667 15.5824 11.6032 15.7356C11.5187 15.9398 11.3564 16.102 11.1522 16.1866C10.9991 16.25 10.805 16.25 10.4167 16.25H6.25C5.86172 16.25 5.66757 16.25 5.51443 16.1866C5.31024 16.102 5.14801 15.9398 5.06343 15.7356Z" fill="currentColor"/>
</svg>
`, Z2 = `<svg width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.0582 12.5774L27.4156 14.9338L29.1832 16.7014L27.4156 18.47L17.2867 28.5989C16.1136 29.772 15.5269 30.3588 14.8912 30.8567C13.3002 32.1028 11.4462 32.9712 9.47034 33.3958C9.23602 33.4461 8.99836 33.4875 8.73694 33.5256C8.11765 33.6159 7.36438 33.6847 6.20276 33.7903C6.30835 32.6288 6.37614 31.8753 6.46643 31.2561C6.50454 30.9948 6.54698 30.7569 6.59729 30.5227C7.02183 28.5468 7.89019 26.6929 9.13635 25.1018C9.63425 24.4661 10.221 23.8795 11.3942 22.7063L21.5231 12.5774L23.2906 10.8088L25.0582 12.5774ZM13.1617 24.4739C11.9466 25.6891 11.4871 26.1539 11.1041 26.6428C10.1177 27.9023 9.42306 29.365 9.06897 30.9241C10.628 30.57 12.0897 29.8744 13.3492 28.8879C13.8381 28.505 14.3032 28.0463 15.5182 26.8313L25.6481 16.7014L23.2906 14.345L13.1617 24.4739ZM10.5836 3.85669C10.7388 3.76934 10.9285 3.76919 11.0836 3.85669C11.2634 3.95812 11.3806 4.3561 11.6149 5.15063L11.9928 6.43286C12.1236 6.87663 12.1891 7.0989 12.3102 7.28149C12.4175 7.4432 12.5567 7.58238 12.7184 7.6897C12.901 7.81083 13.1231 7.87621 13.567 8.00708L14.8502 8.38501C15.6443 8.61912 16.0416 8.7366 16.1432 8.91626C16.2308 9.07152 16.2308 9.26198 16.1432 9.41724C16.0415 9.59687 15.6443 9.71439 14.8502 9.94849L13.567 10.3264C13.1231 10.4573 12.901 10.5227 12.7184 10.6438C12.5567 10.7511 12.4175 10.8894 12.3102 11.051C12.1889 11.2337 12.1237 11.4565 11.9928 11.9006L11.6149 13.1829C11.3806 13.9774 11.2634 14.3754 11.0836 14.4768C10.9285 14.5643 10.7388 14.5641 10.5836 14.4768C10.4038 14.3754 10.2866 13.9774 10.0524 13.1829L9.67346 11.9006C9.54252 11.4565 9.47732 11.2337 9.35608 11.051C9.24883 10.8895 9.11037 10.751 8.94885 10.6438C8.76617 10.5226 8.54339 10.4574 8.09924 10.3264L6.81702 9.94849C6.02319 9.71445 5.62592 9.59676 5.52405 9.41724C5.43646 9.26198 5.43646 9.07152 5.52405 8.91626C5.62587 8.73671 6.02311 8.61907 6.81702 8.38501L8.09924 8.00708C8.54339 7.87614 8.76617 7.81094 8.94885 7.6897C9.11051 7.58239 9.24879 7.44316 9.35608 7.28149C9.47722 7.09886 9.54258 6.87681 9.67346 6.43286L10.0524 5.15063C10.2866 4.35609 10.4038 3.95812 10.5836 3.85669ZM28.6686 5.68872C29.0033 5.58003 29.3642 5.57998 29.6989 5.68872C30.0792 5.81247 30.4093 6.14235 31.069 6.802L33.1901 8.92407C33.85 9.58404 34.1807 9.91366 34.3043 10.2942C34.4131 10.6289 34.4131 10.9897 34.3043 11.3245C34.1807 11.705 33.85 12.0346 33.1901 12.6946L31.5406 14.345L25.6481 8.45239L27.2975 6.802C27.9575 6.142 28.288 5.81237 28.6686 5.68872Z" fill="currentColor"/>
</svg>
`, R2 = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.86638 1.86139C9.96174 1.82908 10.0659 1.83231 10.1595 1.87107C10.2361 1.90279 10.3047 1.97143 10.442 2.10871L14.2722 5.93887L14.2722 5.93888C14.4095 6.07615 14.4781 6.14479 14.5098 6.22136C14.5521 6.32345 14.5521 6.43817 14.5098 6.54026C14.4781 6.61683 14.4095 6.68547 14.2722 6.82275C14.1349 6.96003 14.0663 7.02867 13.9897 7.06039C13.8876 7.10268 13.7729 7.10268 13.6708 7.06039C13.5942 7.02867 13.5256 6.96003 13.3883 6.82275L10.6249 4.05938V13.5418C10.6249 13.7359 10.6249 13.833 10.5932 13.9095C10.5509 14.0116 10.4698 14.0928 10.3677 14.135C10.2911 14.1668 10.1941 14.1668 9.99992 14.1668C9.80578 14.1668 9.70871 14.1668 9.63214 14.135C9.53004 14.0928 9.44893 14.0116 9.40664 13.9095C9.37492 13.833 9.37492 13.7359 9.37492 13.5418V4.05964L6.61181 6.82275L6.61181 6.82275L6.61181 6.82276C6.47453 6.96003 6.40589 7.02867 6.32932 7.06039C6.22723 7.10268 6.11252 7.10268 6.01042 7.06039C5.93385 7.02867 5.86521 6.96003 5.72794 6.82276L5.72793 6.82276L5.72793 6.82275L5.72793 6.82275C5.59065 6.68547 5.52201 6.61683 5.49029 6.54026C5.44801 6.43817 5.44801 6.32345 5.49029 6.22136C5.52201 6.14479 5.59065 6.07615 5.72793 5.93887L9.52863 2.13817L9.86638 1.86139ZM9.86638 1.86139L9.57134 2.0955C9.6999 1.96699 9.76655 1.90176 9.84063 1.87107C9.84913 1.86755 9.85772 1.86432 9.86638 1.86139ZM2.53172 10.2573C2.5 10.3339 2.5 10.431 2.5 10.6251V13.3334V14.8334C2.5 15.7669 2.5 16.2336 2.68166 16.5901C2.84144 16.9037 3.09641 17.1587 3.41002 17.3184C3.76654 17.5001 4.23325 17.5001 5.16667 17.5001H14.8333C15.7668 17.5001 16.2335 17.5001 16.59 17.3184C16.9036 17.1587 17.1586 16.9037 17.3183 16.5901C17.5 16.2336 17.5 15.7669 17.5 14.8334V13.3334V10.6251C17.5 10.431 17.5 10.3339 17.4683 10.2573C17.426 10.1552 17.3449 10.0741 17.2428 10.0318C17.1662 10.0001 17.0691 10.0001 16.875 10.0001C16.6809 10.0001 16.5838 10.0001 16.5072 10.0318C16.4051 10.0741 16.324 10.1552 16.2817 10.2573C16.25 10.3339 16.25 10.431 16.25 10.6251V13.3334V14.8334C16.25 15.3208 16.249 15.6111 16.2314 15.8263C16.2207 15.9576 16.2066 16.0129 16.202 16.0277C16.1628 16.1021 16.102 16.1629 16.0276 16.2021C16.0128 16.2067 15.9576 16.2208 15.8262 16.2315C15.611 16.2491 15.3207 16.2501 14.8333 16.2501H5.16667C4.67933 16.2501 4.389 16.2491 4.17379 16.2315C4.04245 16.2208 3.98724 16.2067 3.97244 16.2021C3.89804 16.1629 3.83724 16.1021 3.79804 16.0277C3.79345 16.0129 3.77929 15.9577 3.76856 15.8263C3.75097 15.6111 3.75 15.3208 3.75 14.8334V13.3334V10.6251C3.75 10.431 3.75 10.3339 3.71828 10.2573C3.67599 10.1552 3.59488 10.0741 3.49278 10.0318C3.41621 10.0001 3.31914 10.0001 3.125 10.0001C2.93086 10.0001 2.83379 10.0001 2.75722 10.0318C2.65512 10.0741 2.57401 10.1552 2.53172 10.2573ZM16.2014 16.0295L16.2005 16.032C16.2005 16.032 16.2005 16.0319 16.2006 16.0316C16.2008 16.0312 16.201 16.0305 16.2014 16.0295ZM16.0319 16.2006C16.0319 16.2006 16.0312 16.2009 16.0294 16.2015L16.0319 16.2006ZM3.97065 16.2015L3.96823 16.2006L3.96867 16.2008L3.97065 16.2015ZM3.79955 16.032C3.79953 16.032 3.7992 16.0312 3.79861 16.0295L3.79955 16.032Z" fill="var(--text---color-text-caption, #010B32)" fill-opacity="0.41"/>
</svg>
`, D2 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.8 3.5C13.3848 3.5 13.7332 3.50117 13.9914 3.52227C14.1491 3.53514 14.2153 3.55214 14.2331 3.55765C14.3224 3.60469 14.3953 3.67765 14.4424 3.76693C14.4479 3.78468 14.4649 3.85094 14.4777 4.00855C14.4963 4.23591 14.4994 4.53312 14.4999 5H9.50008C9.50056 4.53312 9.50369 4.23591 9.52227 4.00855C9.53514 3.85093 9.55214 3.78468 9.55765 3.76692C9.60469 3.67765 9.67765 3.60469 9.76692 3.55765C9.78468 3.55214 9.85093 3.53514 10.0086 3.52227C10.2668 3.50117 10.6152 3.5 11.2 3.5H12.8ZM15.9999 5C15.9992 4.01165 15.9866 3.49359 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8.01338 3.49359 8.00082 4.01165 8.00005 5H6.50259H5H3.75C3.51703 5 3.40054 5 3.30866 5.03806C3.18614 5.08881 3.08881 5.18614 3.03806 5.30866C3 5.40054 3 5.51703 3 5.75C3 5.98297 3 6.09946 3.03806 6.19134C3.08881 6.31386 3.18614 6.41119 3.30866 6.46194C3.40054 6.5 3.51703 6.5 3.75 6.5H5.08824L5.82282 18.9879C5.88518 20.0481 5.91636 20.5782 6.14264 20.9805C6.34183 21.3346 6.64416 21.6197 7.00938 21.7977C7.42426 22 7.95527 22 9.0173 22H14.9827C16.0447 22 16.5757 22 16.9906 21.7977C17.3558 21.6197 17.6582 21.3346 17.8574 20.9805C18.0836 20.5782 18.1148 20.0481 18.1772 18.9879L18.9118 6.5H20.25C20.483 6.5 20.5995 6.5 20.6913 6.46194C20.8139 6.41119 20.9112 6.31386 20.9619 6.19134C21 6.09946 21 5.98297 21 5.75C21 5.51703 21 5.40054 20.9619 5.30866C20.9112 5.18614 20.8139 5.08881 20.6913 5.03806C20.5995 5 20.483 5 20.25 5H19H17.4974H15.9999ZM17.4092 6.5L16.6798 18.8998C16.6472 19.4539 16.6268 19.7817 16.5931 20.0242C16.5725 20.1722 16.5532 20.2337 16.5471 20.2501C16.4983 20.3347 16.4257 20.4031 16.3385 20.4469C16.3218 20.452 16.2592 20.4676 16.1102 20.4795C15.8662 20.4989 15.5377 20.5 14.9827 20.5H9.0173C8.46229 20.5 8.13378 20.4989 7.88977 20.4795C7.74078 20.4676 7.67824 20.452 7.66154 20.4469C7.57426 20.4031 7.50172 20.3347 7.45287 20.2501C7.44683 20.2337 7.42755 20.1722 7.40695 20.0242C7.37322 19.7817 7.35282 19.4539 7.32023 18.8998L6.59083 6.5H8H9.5H14.5H16H17.4092ZM14.2383 3.55945L14.2352 3.55833C14.2374 3.55904 14.2383 3.55943 14.2383 3.55945ZM14.4405 3.76175C14.4406 3.76169 14.441 3.76264 14.4417 3.76478L14.4405 3.76175ZM9.55944 3.76176L9.55833 3.76478L9.55941 3.76181L9.55944 3.76176ZM9.76177 3.55943L9.76181 3.55941L9.76231 3.5592L9.76478 3.55833L9.76175 3.55945C9.76174 3.55945 9.76175 3.55944 9.76177 3.55943ZM16.5452 20.2549L16.5465 20.2517C16.5457 20.2539 16.5452 20.2549 16.5452 20.2549ZM16.3429 20.4454C16.3432 20.4453 16.3433 20.4452 16.3433 20.4452L16.3401 20.4464L16.3429 20.4454ZM7.6567 20.4452L7.65989 20.4464C7.65764 20.4456 7.65664 20.4452 7.6567 20.4452ZM7.45481 20.2549C7.45479 20.2549 7.45433 20.254 7.45348 20.2517L7.45481 20.2549ZM9.08465 8.77908C9.07652 8.54626 9.07245 8.42984 9.10728 8.33668C9.15372 8.21247 9.2476 8.1118 9.36827 8.05681C9.45877 8.01556 9.57518 8.0115 9.80801 8.00337H9.80801H9.80802C10.0408 7.99524 10.1573 7.99117 10.2504 8.026C10.3746 8.07244 10.4753 8.16632 10.5303 8.28699C10.5715 8.37749 10.5756 8.49391 10.5837 8.72674L10.9153 18.2209C10.9234 18.4538 10.9275 18.5702 10.8926 18.6633C10.8462 18.7876 10.7523 18.8882 10.6317 18.9432C10.5412 18.9845 10.4247 18.9885 10.1919 18.9967H10.1919C9.95908 19.0048 9.84267 19.0089 9.74951 18.974C9.6253 18.9276 9.52462 18.8337 9.46963 18.713C9.42839 18.6225 9.42432 18.5061 9.41619 18.2733L9.08465 8.77908ZM13.4696 8.28697C13.4284 8.37747 13.4243 8.49389 13.4162 8.72672L13.0847 18.2209C13.0765 18.4538 13.0725 18.5702 13.1073 18.6633C13.1537 18.7875 13.2476 18.8882 13.3683 18.9432C13.4588 18.9844 13.5752 18.9885 13.808 18.9966H13.808C14.0409 19.0048 14.1573 19.0088 14.2504 18.974C14.3746 18.9276 14.4753 18.8337 14.5303 18.713C14.5716 18.6225 14.5756 18.5061 14.5837 18.2733L14.9153 8.77907V8.77906C14.9234 8.54623 14.9275 8.42982 14.8927 8.33666C14.8462 8.21245 14.7523 8.11178 14.6317 8.05679C14.5412 8.01554 14.4248 8.01148 14.1919 8.00335C13.9591 7.99522 13.8427 7.99115 13.7495 8.02598C13.6253 8.07242 13.5246 8.1663 13.4696 8.28697Z" fill="var(--text---color-text-white, white)"/>
</svg>
`;
var T2 = Object.defineProperty, P2 = Object.getOwnPropertyDescriptor, B2 = (e, t, i) => t in e ? T2(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, E2 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? P2(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, I3 = (e, t, i) => B2(e, typeof t != "symbol" ? t + "" : t, i);
let q = class extends _ {
  /**
   * 组件安装后设置宿主元素属性
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    e && e.setAttribute("data-w-component", "icon");
  }
  /**
   * 映射图标尺寸
   */
  mapIconSize(e) {
    return e && {
      "3xs": "var(--icon-size-md)",
      // 16px
      "2xs": "var(--icon-size-md)",
      // 16px
      xs: "var(--icon-size-xs)",
      // 12px
      sm: "var(--icon-size-sm)",
      // 14px
      md: "var(--icon-size-md)",
      // 16px
      lg: "var(--icon-size-lg)",
      // 18px
      xl: "var(--icon-size-xl)",
      // 20px
      "2xl": "var(--icon-size-2xl)",
      // 24px
      "3xl": "var(--icon-size-3xl)"
      // 32px
    }[e] || "var(--icon-size-md)";
  }
  /**
   * 获取 SVG 内容（从导入的文件中）
   */
  getSvg(e) {
    return {
      search: y1,
      check: _1,
      "check-circle": L1,
      "check-circle-filled": S1,
      "chevron-left": M1,
      "chevron-right": H1,
      "chevron-up": k1,
      "chevron-down": z1,
      "chevron-up-down": A1,
      close: V1,
      plus: $1,
      star: Z1,
      "star-filled": R1,
      info: E3,
      "circle-question": D1,
      calendar: T1,
      chart: P1,
      "settings-slider": B1,
      user: E1,
      mail: I1,
      phone: O1,
      desktop: F1,
      mobile: N1,
      document: j1,
      images: q1,
      globe: W1,
      "map-pin": U1,
      play: J1,
      reload: Y1,
      "external-link": G1,
      bug: K1,
      lightbulb: X1,
      "dots-horizontal": Q1,
      "dots-vertical": t2,
      cube: e2,
      agent: i2,
      analytics: r2,
      atom: o2,
      batch: n2,
      bolt: a2,
      "book-open": s2,
      "book-closed": l2,
      "book-clock": d2,
      compass: c2,
      confetti: u2,
      dot: p2,
      "empty-circle": h2,
      keys: C2,
      lab: f2,
      lifesaver: g2,
      maps: m2,
      name: v2,
      notebook: b2,
      "notebook-pencil": x2,
      "page-blank": w2,
      profile: y2,
      "profile-card": _2,
      sparkle: L2,
      "sparkle-double": S2,
      "square-code": M2,
      "square-image": H2,
      "square-text": k2,
      suitcase: z2,
      wreath: A2,
      write: V2,
      "write-alt": $2,
      "write-alt2": Z2,
      "upload-normal": R2,
      "delete-white": D2
    }[e] || "";
  }
  render(e) {
    const { name: t, size: i = "md", color: o } = e, r = this.mapIconSize(i), n = o ? C3(o) : "currentColor", a = this.getSvg(t);
    if (!a)
      return /* @__PURE__ */ c(
        "span",
        {
          class: "text-base",
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: r,
            height: r,
            background: "#f0f0f0",
            borderRadius: "4px",
            color: "#999",
            fontSize: `calc(${r} * 0.6)`
          }
        },
        t.slice(0, 2).toUpperCase()
      );
    const d = a.replace(
      /<svg /,
      `<svg style="display: block; width: ${r}; height: ${r}; color: ${n};" `
    );
    return /* @__PURE__ */ c("span", { innerHTML: d });
  }
};
I3(q, "props", {
  name: String,
  size: String,
  color: String
});
I3(q, "css", `${S}${w1}`);
q = E2([
  y("icon-widget")
], q);
var I2 = Object.defineProperty, O2 = Object.getOwnPropertyDescriptor, F2 = (e, t, i) => t in e ? I2(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, N2 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? O2(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, O3 = (e, t, i) => F2(e, typeof t != "symbol" ? t + "" : t, i);
let W = class extends _ {
  // 当前选中的值
  currentValue = "";
  // 下拉菜单是否打开
  isOpen = !1;
  // 隐藏的原生 select 用于表单提交
  hiddenSelect = null;
  // 文档点击事件处理器引用，用于正确移除监听器
  documentClickHandler = null;
  // Portal 容器（用于将下拉菜单渲染到 body）
  portalContainer = null;
  // 触发器元素引用
  triggerRef = null;
  installed() {
    this.currentValue = this.props.defaultValue || "", this.updateHostAttributes(), this.setupHiddenSelect(), this.createPortalContainer(), this.documentClickHandler = this.handleDocumentClick.bind(this), document.addEventListener("click", this.documentClickHandler), window.addEventListener("scroll", this.updateDropdownPosition, !0), window.addEventListener("resize", this.updateDropdownPosition);
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    e && (e.setAttribute("data-w-component", "select"), this.props.block !== !1 ? e.setAttribute("data-block", "") : e.removeAttribute("data-block"));
  }
  uninstalled() {
    this.documentClickHandler && document.removeEventListener("click", this.documentClickHandler), window.removeEventListener("scroll", this.updateDropdownPosition, !0), window.removeEventListener("resize", this.updateDropdownPosition), this.removePortalContainer();
  }
  /**
   * 创建 Portal 容器
   */
  createPortalContainer() {
    this.portalContainer = document.createElement("div"), this.portalContainer.className = "select-widget-portal", this.portalContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      pointer-events: none;
    `;
    const e = this.portalContainer.attachShadow({ mode: "open" }), t = document.createElement("style");
    t.textContent = `
      ${S}
      ${B3}
      .dropdown-menu {
        pointer-events: auto;
      }
    `, e.appendChild(t);
    const i = document.createElement("div");
    i.className = "menu-container", e.appendChild(i), document.body.appendChild(this.portalContainer);
  }
  /**
   * 移除 Portal 容器
   */
  removePortalContainer() {
    this.portalContainer && this.portalContainer.parentNode && (this.portalContainer.parentNode.removeChild(this.portalContainer), this.portalContainer = null);
  }
  /**
   * 获取 Portal 的 Shadow Root
   */
  getPortalShadowRoot() {
    return this.portalContainer?.shadowRoot || null;
  }
  /**
   * 更新下拉菜单位置
   */
  updateDropdownPosition = () => {
    if (!this.isOpen || !this.triggerRef || !this.portalContainer) return;
    const e = this.getPortalShadowRoot();
    if (!e) return;
    const t = this.triggerRef.getBoundingClientRect(), i = e.querySelector(
      ".dropdown-menu"
    );
    if (!i) return;
    const r = window.innerHeight - t.bottom, n = t.top, a = i.offsetHeight || 200;
    let d, s;
    r >= a || r >= n ? (d = t.bottom + 4, s = "top center") : (d = t.top - a - 4, s = "bottom center"), i.style.cssText = `
      position: fixed;
      top: ${d}px;
      left: ${t.left}px;
      width: ${t.width}px;
      min-width: ${t.width}px;
      z-index: 9999;
      pointer-events: auto;
      transform-origin: ${s};
    `;
  };
  /**
   * 渲染下拉菜单到 Portal
   */
  renderDropdownToPortal() {
    const e = this.getPortalShadowRoot();
    if (!e) return;
    const t = e.querySelector(".menu-container");
    if (t)
      if (this.isOpen) {
        const i = this.createDropdownMenuHtml();
        t.innerHTML = i;
        const o = (r) => {
          const a = r.target.closest("._Option_pdvhu_70");
          if (a) {
            const d = a.getAttribute("data-option-id");
            !a.hasAttribute("data-disabled") && d && this.handleOptionSelect(d);
          }
        };
        t.addEventListener("click", o), requestAnimationFrame(() => {
          this.updateDropdownPosition();
        });
      } else
        t.innerHTML = "";
  }
  /**
   * 创建下拉菜单 HTML
   */
  createDropdownMenuHtml() {
    const e = this.getOptionsConfig();
    return e.length === 0 ? `
        <div
          data-theme="light"
          data-side="bottom"
          data-align="center"
          role="dialog"
          class="_MenuList_pdvhu_8 dropdown-menu"
          style="--radix-popover-content-transform-origin: var(--radix-popper-transform-origin);
                 --radix-popover-content-available-width: var(--radix-popper-available-width);
                 --radix-popover-content-available-height: var(--radix-popper-available-height);
                 --radix-popover-trigger-width: var(--radix-popper-anchor-width);
                 --radix-popover-trigger-height: var(--radix-popper-anchor-height);"
        >
          <div class="_MenuInner_pdvhu_53">
            <p class="_SearchEmpty_pdvhu_282" data-text-only="true">${b(
      "select.noResults"
    )}</p>
          </div>
        </div>
      ` : `
      <div
        data-theme="light"
        data-side="bottom"
        data-align="center"
        role="dialog"
        class="_MenuList_pdvhu_8 dropdown-menu"
        style="--radix-popover-content-transform-origin: var(--radix-popper-transform-origin);
               --radix-popover-content-available-width: var(--radix-popper-available-width);
               --radix-popover-content-available-height: var(--radix-popper-available-height);
               --radix-popover-trigger-width: var(--radix-popper-anchor-width);
               --radix-popover-trigger-height: var(--radix-popper-anchor-height);"
      >
        <div class="_MenuInner_pdvhu_53">
          <div class="_OptionsList_pdvhu_70">
            ${e.map((i) => {
      const o = i.value === this.currentValue, r = i.disabled, n = o ? `
        <svg class="_OptionCheck_pdvhu_135" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M18.063 5.674a1 1 0 0 1 .263 1.39l-7.5 11a1 1 0 0 1-1.533.143l-4.5-4.5a1 1 0 1 1 1.414-1.414l3.647 3.647 6.82-10.003a1 1 0 0 1 1.39-.263Z" clip-rule="evenodd"></path>
        </svg>
      ` : "", a = i.description ? `
        <div class="_OptionInner_pdvhu_128">
          <div class="_OptionIndicatorSlot_pdvhu_142"></div>
          ${this.escapeHtml(i.description)}
        </div>
      ` : "";
      return `
        <div
          role="option"
          data-option-id="${this.escapeHtml(i.value)}"
          ${o ? 'aria-selected="true" data-selected="true"' : ""}
          ${r ? 'aria-disabled="true" data-disabled="true"' : ""}
          class="_Option_pdvhu_70 ${o ? "selected" : ""} ${r ? "disabled" : ""}"
        >
          <div class="_PressableInner_pdvhu_124">
            <div class="_OptionInner_pdvhu_128">
              <div class="_OptionIndicatorSlot_pdvhu_142">
                ${n}
              </div>
              ${this.escapeHtml(i.label)}
            </div>
            ${a}
          </div>
        </div>
      `;
    }).join("")}
          </div>
        </div>
      </div>
    `;
  }
  /**
   * HTML 转义
   */
  escapeHtml(e) {
    const t = document.createElement("div");
    return t.textContent = e, t.innerHTML;
  }
  updated() {
    this.updateHiddenSelect(), this.renderDropdownToPortal();
  }
  /**
   * 设置隐藏的 select 元素用于表单提交
   */
  setupHiddenSelect() {
    try {
      this.hiddenSelect = document.createElement("select"), this.hiddenSelect.name = this.props.name || "", this.hiddenSelect.style.display = "none", this.shadowRoot?.appendChild(this.hiddenSelect), this.updateHiddenSelect();
    } catch (e) {
      console.error(b("select.setupError"), e);
    }
  }
  /**
   * 更新隐藏的 select 选项
   */
  updateHiddenSelect() {
    if (this.hiddenSelect)
      try {
        this.hiddenSelect.innerHTML = "", this.getOptionsConfig().forEach((t) => {
          const i = document.createElement("option");
          i.value = t.value, i.textContent = t.label, i.selected = t.value === this.currentValue, this.hiddenSelect?.appendChild(i);
        });
      } catch (e) {
        console.error(b("select.updateError"), e);
      }
  }
  /**
   * 处理文档点击事件，关闭下拉菜单
   */
  handleDocumentClick(e) {
    if (!this.isOpen) return;
    const t = e.composedPath(), i = this.shadowRoot?.querySelector("._SelectControl_tkgz5_1");
    if (i && t.includes(i))
      return;
    const o = this.getPortalShadowRoot();
    if (o) {
      const r = o.querySelector(".dropdown-menu");
      if (r && t.includes(r))
        return;
    }
    this.closeDropdown();
  }
  /**
   * 关闭下拉菜单
   */
  closeDropdown = () => {
    this.isOpen = !1, this.scheduleUpdate();
  };
  /**
   * 处理选项选择
   */
  handleOptionSelect = (e) => {
    console.log("handleOptionSelect", e), this.currentValue = e, this.closeDropdown(), this.props.onChangeAction && this.fire("changeAction", {
      ...this.props.onChangeAction,
      payload: M3(this.props.name || "select", e)
    }), this.updateHiddenSelect(), this.update();
  };
  toggleDropdown = () => {
    this.props.disabled || (this.isOpen = !this.isOpen, this.scheduleUpdate());
  };
  /**
   * 清除当前选择
   */
  handleClear = () => {
    this.currentValue = "", this.props.onChangeAction && this.fire("changeAction", {
      ...this.props.onChangeAction,
      payload: M3(this.props.name || "select", "")
    }), this.updateHiddenSelect(), this.update();
  };
  /**
   * 获取选项配置
   */
  getOptionsConfig() {
    return this.props.options || [];
  }
  /**
   * 渲染当前选中的显示内容
   * 使用 _TriggerText_tkgz5_507 类实现文本超出省略号
   */
  renderSelectedContent() {
    if (!this.currentValue)
      return c(
        "span",
        { class: "_TriggerText_tkgz5_507" },
        this.props.placeholder || b("select.placeholder")
      );
    const t = this.getOptionsConfig().find(
      (o) => o.value === this.currentValue
    );
    if (!t)
      return c("span", { class: "_TriggerText_tkgz5_507" }, this.currentValue);
    const i = t.color ? { color: t.color } : {};
    return c(
      "span",
      {
        class: "_TriggerText_tkgz5_507",
        style: i
      },
      [
        // 图标
        t.icon && c("span", { class: "_StartIcon_tkgz5_484" }, t.icon),
        // 主标签
        t.label,
        // 徽章
        t.badge && c("span", { class: "_Badge_tkgz5_490" }, t.badge)
      ]
    );
  }
  /**
   * 调度更新，使用requestAnimationFrame确保DOM更新
   */
  scheduleUpdate() {
    requestAnimationFrame(() => {
      this.updateSelf();
    });
  }
  /**
   * 渲染清除按钮
   */
  renderClearButton(e, t) {
    return e ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        class: "_Button_1jdeq_1 _Clear_tkgz5_471",
        "data-color": "secondary",
        "data-variant": "ghost",
        "data-pill": "",
        "data-uniform": "",
        "data-size": "3xs",
        "aria-label": b("select.clearLabel"),
        onclick: this.handleClear,
        disabled: t
      },
      /* @__PURE__ */ c("span", { class: "_ButtonInner_1jdeq_4" }, /* @__PURE__ */ c("svg", { width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ c(
        "path",
        {
          "fill-rule": "evenodd",
          d: "M5.636 5.636a1 1 0 0 1 1.414 0l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414L13.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 0-1.414Z",
          "clip-rule": "evenodd"
        }
      )))
    ) : null;
  }
  /**
   * 根据 Select 的 size 计算 dropdown icon 的 size
   */
  getDropdownIconSize(e) {
    return {
      "3xs": "xs",
      "2xs": "xs",
      xs: "xs",
      sm: "xs",
      md: "sm",
      lg: "sm",
      xl: "sm",
      "2xl": "md",
      "3xl": "md"
    }[e] || "sm";
  }
  /**
   * 渲染下拉箭头图标
   */
  renderDropdownIcon() {
    const e = this.props.size || "md", t = this.getDropdownIconSize(e);
    return /* @__PURE__ */ c(
      "icon-widget",
      {
        name: "chevron-up-down",
        class: "_DropdownIcon_tkgz5_472",
        size: t
      }
    );
  }
  /**
   * 渲染隐藏输入框（用于表单提交）
   */
  renderHiddenInput() {
    return /* @__PURE__ */ c(
      "input",
      {
        id: `hidden-input-${this.props.name}`,
        tabindex: "-1",
        class: "sr-only w-full h-0 left-0 bottom-0 pointer-events-none",
        "aria-hidden": "true",
        value: this.currentValue,
        name: this.props.name || "select.full"
      }
    );
  }
  render(e) {
    const {
      name: t,
      variant: i = "outline",
      size: o = "md",
      pill: r = !1,
      block: n = !0,
      // 默认为 true
      disabled: a = !1,
      clearable: d = !1
    } = e, s = !!(d && this.currentValue && !a), l = {
      "data-name": t,
      "data-theme": "light",
      "data-variant": i,
      "data-size": o
    };
    r && (l["data-pill"] = !0), n && (l["data-block"] = !0), a && (l["data-disabled"] = !0), d && (l["data-clearable"] = !0), this.isOpen && (l["data-state"] = !0);
    const u = ["_SelectControl_tkgz5_1", "_Select_9rlww_1"].filter(Boolean).join(" "), C = {
      class: "select-widget select-container"
    };
    return n && (C["data-block"] = ""), /* @__PURE__ */ c("div", { ...C }, /* @__PURE__ */ c(
      "span",
      {
        class: u,
        onclick: this.toggleDropdown,
        role: "button",
        tabindex: "0",
        ref: (g) => {
          this.triggerRef = g;
        },
        ...l
      },
      this.renderSelectedContent(),
      this.renderHiddenInput(),
      /* @__PURE__ */ c("div", { class: "_IndicatorWrapper_tkgz5_517" }, this.renderClearButton(s, a), this.renderDropdownIcon())
    ));
  }
};
O3(W, "props", {
  name: String,
  options: Array,
  placeholder: String,
  defaultValue: String,
  variant: String,
  // "outline" | "solid" | "soft" | "ghost"
  size: String,
  // "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  pill: Boolean,
  // 是否使用圆形药片形状
  block: Boolean,
  // 是否扩展到100%宽度
  disabled: Boolean,
  clearable: Boolean,
  onChangeAction: Function
});
O3(W, "css", `
     ${B3}
     ${S}
  `);
W = N2([
  y("select-widget")
], W);
const j2 = ":host{display:inline-block;vertical-align:middle;line-height:0}:host([data-block]){display:block;width:100%}:host([data-block]) ._Button_1jdeq_1{width:100%}";
class v3 {
  render(t, i) {
    const { name: o, size: r, color: n } = t;
    return {
      tag: "icon-widget",
      props: {
        name: o,
        size: r,
        color: n
      }
    };
  }
}
var q2 = Object.defineProperty, W2 = Object.getOwnPropertyDescriptor, U2 = (e, t, i) => t in e ? q2(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, J2 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? W2(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, F3 = (e, t, i) => U2(e, typeof t != "symbol" ? t + "" : t, i);
let U = class extends _ {
  iconAdapter = new v3();
  /**
   * 组件安装后，根据 block 属性设置宿主元素样式
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时，重新设置宿主元素样式
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 根据 block 属性设置宿主元素 data-block 属性和 data-w-component 属性
   * CSS 会通过 :host([data-block]) 选择器应用样式
   */
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    e.setAttribute("data-w-component", "button"), this.props.block ? e.hasAttribute("data-block") || e.setAttribute("data-block", "") : e.hasAttribute("data-block") && e.removeAttribute("data-block");
  }
  /**
   * 处理按钮点击
   */
  handleClick = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.submit) {
      const t = this;
      let i = null;
      const o = t.closest("form-widget");
      if (o && o.shadowRoot && (i = o.shadowRoot.querySelector("form")), !i) {
        const r = t.getRootNode();
        if (r && r.host) {
          const n = r.host;
          if (n.tagName.toLowerCase() === "card-widget") {
            const a = n;
            if (a.shadowRoot && (i = a.shadowRoot.querySelector("form"), !i)) {
              const d = a.shadowRoot.querySelector("form-widget");
              d && d.shadowRoot && (i = d.shadowRoot.querySelector("form"));
            }
          }
        }
      }
      if (i) {
        const r = new Event("submit", {
          bubbles: !0,
          cancelable: !0
        });
        i.dispatchEvent(r);
        return;
      }
    }
    this.props.onClickAction && this.props.onClickAction();
  };
  /**
   * 渲染图标
   * 不传递color，让icon通过:host { color: inherit }继承按钮颜色
   */
  renderIcon(e) {
    const { iconSize: t } = this.props, i = this.iconAdapter.render({
      type: "Icon",
      name: e,
      size: t
      // 不传递color属性
    });
    return c(i.tag, {
      ...i.props,
      ...i.attrs
    });
  }
  render(e) {
    const {
      label: t,
      color: i = "primary",
      variant: o = "solid",
      size: r = "lg",
      pill: n = !1,
      uniform: a = !1,
      block: d = !1,
      disabled: s = !1,
      iconStart: l,
      iconEnd: u,
      iconSize: C = "md",
      submit: g = !1
    } = e, h = {
      "data-color": i,
      "data-variant": o,
      "data-size": r,
      "data-icon-size": C
    };
    return n && (h["data-pill"] = !0), a && (h["data-uniform"] = !0), d && (h["data-block"] = !0), s && (h["data-disabled"] = !0), /* @__PURE__ */ c(
      "button",
      {
        class: "_Button_1jdeq_1",
        type: g ? "submit" : "button",
        disabled: s,
        onClick: this.handleClick,
        ...h
      },
      /* @__PURE__ */ c("span", { class: "_ButtonInner_1jdeq_4" }, l && this.renderIcon(l), t, u && this.renderIcon(u))
    );
  }
};
F3(U, "props", {
  label: String,
  color: String,
  variant: String,
  size: String,
  pill: Boolean,
  uniform: Boolean,
  block: Boolean,
  disabled: Boolean,
  iconStart: String,
  iconEnd: String,
  iconSize: String,
  submit: Boolean,
  onClickAction: Function
});
F3(U, "css", `${S}${j2}`);
U = J2([
  y("button-widget")
], U);
const Y2 = ":host{display:block;width:100%;min-width:0}:host .listview-container{display:flex;flex-direction:column;gap:var(--ListView-gap, var(--controls-gap, var(--spacing-md)));padding:var(--ListView-padding, var(--controls-padding, 0));background:var(--ListView-background, var(--controls-background, transparent));border-radius:var(--ListView-border-radius, var(--controls-border-radius, var(--radius-md)))}:host .listview-items{display:flex;flex-direction:column;gap:var(--ListView-items-gap, var(--controls-items-gap, var(--spacing-xs)))}:host .listview-expand-button{display:flex;align-items:flex-start;justify-content:flex-start;margin-top:var(--ListView-button-margin-top, var(--controls-button-margin-top, var(--spacing-sm)))}:host .listview-status{display:flex;align-items:center;gap:var(--ListView-status-gap, var(--controls-status-gap, var(--spacing-sm)));color:var(--ListView-status-color, var(--controls-status-color, var(--color-text-secondary)));font-size:var(--ListView-status-font-size, var(--controls-status-font-size, var(--font-size-base)));line-height:var(--ListView-status-line-height, var(--controls-status-line-height, var(--line-height-base)));margin-bottom:var(--ListView-status-margin-bottom, var(--controls-status-margin-bottom, var(--spacing-sm)))}:host .listview-status-icon{display:flex;align-items:center;flex-shrink:0}:host .listview-status-text{flex:1;font-weight:var(--ListView-status-font-weight, var(--controls-status-font-weight, var(--font-weight-medium)))}@media(max-width:768px){:host .listview-expand-button{width:100%}:host .listview-expand-button button-widget{width:100%}}";
class N3 {
  render(t, i, o) {
    let r, n;
    t.color || t.variant ? (r = t.color, n = t.variant) : t.style && (t.style === "primary" ? (r = "primary", n = "solid") : t.style === "secondary" && (r = "primary", n = "outline"));
    const a = {
      label: t.label,
      color: r,
      variant: n,
      size: t.size,
      pill: t.pill,
      uniform: t.uniform,
      block: t.block,
      disabled: t.disabled,
      iconStart: t.iconStart,
      iconEnd: t.iconEnd,
      iconSize: t.iconSize,
      submit: t.submit
    };
    return t.onClickAction && (a.actionConfig = t.onClickAction, o && (a.onClickAction = () => {
      o(t.onClickAction);
    })), {
      tag: "button-widget",
      props: a,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {},
        ...t.block ? { "data-block": "" } : {}
      }
    };
  }
}
var G2 = Object.defineProperty, K2 = Object.getOwnPropertyDescriptor, X2 = (e, t, i) => t in e ? G2(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Q2 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? K2(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, j3 = (e, t, i) => X2(e, typeof t != "symbol" ? t + "" : t, i);
let J = class extends _ {
  // 是否展开
  isExpanded = !1;
  // 适配器实例
  buttonAdapter = new N3();
  iconAdapter = new v3();
  // 缓存的按钮配置
  cachedButtonConfig = null;
  lastButtonState = {
    needButton: !1,
    isExpanded: !1,
    hiddenCount: 0
  };
  // RAF 回调 ID，用于清理
  rafId = null;
  // 🔥 locale 变化监听器取消函数
  localeUnsubscribe = null;
  install() {
    this.isExpanded = !1;
  }
  installed() {
    this.updateHostAttributes(), this.updateChildrenVisibility(), this.localeUnsubscribe = z3(() => {
      this.cachedButtonConfig = null, this.update();
    });
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    e && e.setAttribute("data-w-component", "listview");
  }
  updated() {
    this.updateChildrenVisibility();
  }
  /**
   * 组件卸载时清理资源
   */
  uninstalled() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.localeUnsubscribe && (this.localeUnsubscribe(), this.localeUnsubscribe = null), this.cachedButtonConfig = null, this.buttonAdapter = null, this.iconAdapter = null;
  }
  updateChildrenVisibility() {
    const { limit: e, children: t = [], totalChildren: i } = this.props;
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null);
    const o = typeof i == "number" ? i : t.length;
    if (typeof e != "number" || e <= 0 || this.isExpanded || o <= e) {
      this.showAllChildren();
      return;
    }
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const r = this.shadowRoot?.querySelector("slot");
      if (!r) return;
      r.assignedElements().forEach((a, d) => {
        d < e ? a.style.display = "" : a.style.display = "none";
      });
    });
  }
  showAllChildren() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const e = this.shadowRoot?.querySelector("slot");
      if (!e) return;
      e.assignedElements().forEach((i) => {
        i.style.display = "";
      });
    });
  }
  toggleExpand = () => {
    this.isExpanded = !this.isExpanded, this.cachedButtonConfig = null, this.update();
  };
  /**
   * 获取或创建按钮配置
   */
  getButtonConfig(e, t) {
    const i = {
      needButton: e,
      isExpanded: this.isExpanded,
      hiddenCount: t
    };
    if (this.cachedButtonConfig && this.lastButtonState.needButton === i.needButton && this.lastButtonState.isExpanded === i.isExpanded && this.lastButtonState.hiddenCount === i.hiddenCount)
      return this.cachedButtonConfig;
    if (this.lastButtonState = i, !e)
      return this.cachedButtonConfig = null, null;
    const o = this.buttonAdapter.render(
      {
        type: "Button",
        label: this.isExpanded ? b("listview.collapse") : b("listview.expand", { count: t }),
        color: "secondary",
        variant: "outline",
        pill: !0,
        size: "lg",
        block: !0
      },
      void 0,
      void 0
    );
    return o && o.props && (o.props.onClickAction = this.toggleExpand), this.cachedButtonConfig = o, o;
  }
  /**
   * 渲染 Transition 包装器
   */
  renderTransition(e) {
    return c("transition-widget", {}, e);
  }
  /**
   * 渲染状态内容
   */
  renderStatus() {
    const { status: e } = this.props;
    if (!e) return null;
    let t, i;
    if (typeof e == "string")
      t = e;
    else if (e && typeof e == "object")
      t = e.text, i = e.icon;
    else
      return null;
    const o = [];
    if (i) {
      const r = this.iconAdapter.render({
        type: "Icon",
        name: i
      });
      o.push(
        c("div", { class: "_IconContainer_kx556_218" }, [
          c(r.tag, {
            ...r.props,
            ...r.attrs
          })
        ])
      );
    }
    return o.push(
      c(
        "div",
        {
          class: "_Layout_1iiup_1 flex-1",
          "data-item-anchor": "start",
          "data-clip": "false",
          "data-dimension": "height",
          style: "--tg-will-change: auto; --tg-enter-opacity: 1; --tg-enter-transform: translateY(0px); --tg-enter-filter: none; --tg-enter-duration: 600ms; --tg-enter-delay: 500ms; --tg-enter-timing-function: var(--cubic-enter); --tg-exit-opacity: 0; --tg-exit-transform: translateY(-5px); --tg-exit-filter: none; --tg-exit-duration: 600ms; --tg-exit-delay: 0ms; --tg-exit-timing-function: var(--cubic-exit); --tg-initial-opacity: 0; --tg-initial-transform: translateY(3px); --tg-initial-filter: none; --tg-layout-enter-duration: 300ms; --tg-layout-enter-delay: 0ms; --tg-layout-enter-timing-function: var(--cubic-move); --tg-layout-exit-duration: 300ms; --tg-layout-exit-delay: 0ms; --tg-layout-exit-timing-function: var(--cubic-move); --tg-layout-move-duration: 300ms; --tg-layout-move-delay: 0ms; --tg-layout-move-timing-function: var(--cubic-move);"
        },
        [
          this.renderTransition(
            c("div", { class: "flex items-center gap-1" }, [
              c(
                "div",
                { class: "text-secondary text-base font-medium" },
                t
              )
            ])
          )
        ]
      )
    ), c("div", { class: "flex items-center gap-2" }, o);
  }
  render(e) {
    const { limit: t, children: i = [], totalChildren: o } = e, r = typeof o == "number" ? o : i.length, n = typeof t == "number" && t > 0 && r > t, a = typeof t == "number" ? r - t : 0, d = this.getButtonConfig(n, a), s = this.renderStatus();
    return /* @__PURE__ */ c("div", { "data-theme": "light" }, s && /* @__PURE__ */ c(
      "div",
      {
        class: "_Layout_1iiup_1",
        "data-item-anchor": "start",
        "data-clip": "false",
        "data-dimension": "height",
        style: "--tg-will-change: auto; --tg-enter-opacity: 1; --tg-enter-transform: translateY(0px); --tg-enter-filter: none; --tg-enter-duration: 600ms; --tg-enter-delay: 500ms; --tg-enter-timing-function: var(--cubic-enter); --tg-exit-opacity: 0; --tg-exit-transform: translateY(-5px); --tg-exit-filter: none; --tg-exit-duration: 600ms; --tg-exit-delay: 0ms; --tg-exit-timing-function: var(--cubic-exit); --tg-initial-opacity: 0; --tg-initial-transform: translateY(3px); --tg-initial-filter: none; --tg-layout-enter-duration: 300ms; --tg-layout-enter-delay: 0ms; --tg-layout-enter-timing-function: var(--cubic-move); --tg-layout-exit-duration: 300ms; --tg-layout-exit-delay: 0ms; --tg-layout-exit-timing-function: var(--cubic-move); --tg-layout-move-duration: 300ms; --tg-layout-move-delay: 0ms; --tg-layout-move-timing-function: var(--cubic-move);"
      },
      this.renderTransition(s)
    ), /* @__PURE__ */ c(
      "div",
      {
        class: "_Layout_1iiup_1",
        "data-item-anchor": "start",
        "data-clip": "false",
        "data-dimension": "height",
        style: "--tg-will-change: auto; --tg-enter-opacity: 1; --tg-enter-transform: translateY(0px); --tg-enter-filter: none; --tg-enter-duration: 300ms; --tg-enter-delay: 100ms; --tg-enter-timing-function: var(--cubic-enter); --tg-exit-opacity: 0; --tg-exit-transform: translateY(-10px); --tg-exit-filter: none; --tg-exit-duration: 300ms; --tg-exit-delay: 0ms; --tg-exit-timing-function: var(--cubic-exit); --tg-initial-opacity: 0; --tg-initial-transform: translateY(-10px); --tg-initial-filter: none; --tg-layout-enter-duration: 300ms; --tg-layout-enter-delay: 0ms; --tg-layout-enter-timing-function: var(--cubic-move); --tg-layout-exit-duration: 300ms; --tg-layout-exit-delay: 0ms; --tg-layout-exit-timing-function: var(--cubic-move); --tg-layout-move-duration: 300ms; --tg-layout-move-delay: 0ms; --tg-layout-move-timing-function: var(--cubic-move);"
      },
      /* @__PURE__ */ c(
        "div",
        {
          class: "_Layout_1iiup_1",
          "data-item-anchor": "start",
          "data-clip": "false",
          "data-dimension": "height",
          style: "--tg-will-change: auto; --tg-enter-opacity: 1; --tg-enter-transform: none; --tg-enter-filter: none; --tg-enter-duration: 300ms; --tg-enter-delay: 100ms; --tg-enter-timing-function: ease; --tg-exit-opacity: 0; --tg-exit-transform: none; --tg-exit-filter: none; --tg-exit-duration: 200ms; --tg-exit-delay: 0ms; --tg-exit-timing-function: ease; --tg-initial-opacity: 0; --tg-initial-transform: none; --tg-initial-filter: none; --tg-layout-enter-duration: 300ms; --tg-layout-enter-delay: 0ms; --tg-layout-enter-timing-function: var(--cubic-move); --tg-layout-exit-duration: 300ms; --tg-layout-exit-delay: 0ms; --tg-layout-exit-timing-function: var(--cubic-move); --tg-layout-move-duration: 300ms; --tg-layout-move-delay: 0ms; --tg-layout-move-timing-function: var(--cubic-move);"
        },
        /* @__PURE__ */ c("div", { "data-w-container": "list", "data-limit": t, "data-theme": "light" }, /* @__PURE__ */ c("div", { class: "pb-2.5 -mx-2.5" }, /* @__PURE__ */ c("slot", null)), n && /* @__PURE__ */ c("div", { class: "w-[120px]" }, d && c(d.tag, {
          ...d.props,
          ...d.attrs
        })))
      )
    ));
  }
};
j3(J, "props", {
  limit: [Number, String],
  status: Object,
  children: Array,
  totalChildren: [Number, String]
  // 新增：子元素总数属性
});
j3(J, "css", `${S}${Y2}`);
J = Q2([
  y("listview-widget")
], J);
var tt = Object.defineProperty, et = Object.getOwnPropertyDescriptor, it = (e, t, i) => t in e ? tt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, rt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? et(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, q3 = (e, t, i) => it(e, typeof t != "symbol" ? t + "" : t, i);
let Y = class extends _ {
  // 存储当前方向信息
  currentDirection = "col";
  /**
   * 组件安装后设置宿主元素属性
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 组件更新后重新检测方向（防止DOM结构变化）
   */
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    const { flush: t, spacing: i } = this.props;
    e.setAttribute("data-w-component", "divider");
    const o = e.parentElement;
    let r = "col";
    o && (r = o.getAttribute("data-w-direction") || "col"), e.setAttribute("data-w-direction", r), t ? e.setAttribute("data-w-flush", "") : e.removeAttribute("data-w-flush"), i !== void 0 ? e.setAttribute("data-w-manual-spacing", "") : e.removeAttribute("data-w-manual-spacing"), this.currentDirection = r;
  }
  /**
   * 解析尺寸值
   */
  parseSize(e) {
    if (e === void 0) return "1px";
    if (typeof e == "number")
      return `${e}px`;
    if (typeof e == "string") {
      const t = parseFloat(e);
      return !isNaN(t) && e.trim() === t.toString() ? `${t}px` : e;
    }
    return "1px";
  }
  /**
   * 构建样式对象
   */
  buildStyles(e) {
    const { color: t = "default", size: i = 1, spacing: o, flush: r = !1 } = e, n = {};
    if (t === "default" ? n["--divider-color"] = "var(--color-border)" : t === "subtle" ? n["--divider-color"] = "var(--color-border-subtle)" : t === "strong" ? n["--divider-color"] = "var(--color-border)" : n["--divider-color"] = t, n["--divider-size"] = this.parseSize(i), o !== void 0 && (n["--divider-spacing"] = this.parseSize(o)), r && o !== void 0) {
      const a = this.currentDirection, d = this.parseSize(o);
      a === "row" ? (n["margin-block-start"] = d, n["margin-block-end"] = "0") : (n["margin-inline-start"] = d, n["margin-inline-end"] = "0");
    }
    return n;
  }
  render(e) {
    const t = this.buildStyles(e);
    return /* @__PURE__ */ c(
      "div",
      {
        class: "_Divider_1h6iy_1",
        "data-w-direction": this.currentDirection,
        "data-w-manual-spacing": e.spacing !== void 0 ? "" : void 0,
        "data-w-flush": e.flush ? "" : void 0,
        style: t,
        role: "separator",
        "aria-orientation": this.currentDirection === "row" ? "vertical" : "horizontal"
      }
    );
  }
};
q3(Y, "props", {
  color: String,
  size: [String, Number],
  spacing: [String, Number],
  flush: Boolean
});
q3(Y, "css", `${S}`);
Y = rt([
  y("divider-widget")
], Y);
var ot = Object.defineProperty, nt = Object.getOwnPropertyDescriptor, at = (e, t, i) => t in e ? ot(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, st = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? nt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, W3 = (e, t, i) => at(e, typeof t != "symbol" ? t + "" : t, i);
let G = class extends _ {
  // 存储当前方向信息
  currentDirection = "row";
  /**
   * 组件安装后设置宿主元素属性
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    const { minSize: t } = this.props;
    e.setAttribute("data-w-component", "spacer");
    const i = e.parentElement;
    let o = "row";
    i ? (o = i.getAttribute("data-w-direction") || "row", e.setAttribute("data-w-direction", o), t === "auto" && i.setAttribute("data-w-auto-spacing", "auto")) : e.setAttribute("data-w-direction", o), this.currentDirection = o;
  }
  render(e) {
    const { minSize: t } = e, i = {};
    if (t !== void 0) {
      const o = typeof t == "number" ? `${t}px` : t;
      i["--w-spacer-min-size"] = o;
    }
    return /* @__PURE__ */ c(
      "div",
      {
        class: "_Spacer_961eb_1",
        "data-w-direction": this.currentDirection,
        style: i
      }
    );
  }
};
W3(G, "props", {
  minSize: [String, Number]
});
W3(G, "css", `${S}`);
G = st([
  y("spacer-widget")
], G);
const lt = "._TextBase_bwepc_1[data-color=prose]{color:var(--color-text-prose)}._TextBase_bwepc_1[data-color=primary]{color:var(--color-text-primary)}._TextBase_bwepc_1[data-color=emphasis]{color:var(--color-text-emphasis)}._TextBase_bwepc_1[data-color=secondary]{color:var(--color-text-secondary)}._TextBase_bwepc_1[data-color=tertiary]{color:var(--color-text-tertiary)}._TextBase_bwepc_1[data-color=success]{color:var(--color-text-success)}._TextBase_bwepc_1[data-color=warning]{color:var(--color-text-warning)}._TextBase_bwepc_1[data-color=danger]{color:var(--color-text-danger)}._TextBase_bwepc_1[data-color=info]{color:var(--color-text-info)}._Textarea_bwepc_124[data-color=prose]{color:var(--color-text-prose)}._Textarea_bwepc_124[data-color=primary]{color:var(--color-text-primary)}._Textarea_bwepc_124[data-color=emphasis]{color:var(--color-text-emphasis)}._Textarea_bwepc_124[data-color=secondary]{color:var(--color-text-secondary)}._Textarea_bwepc_124[data-color=tertiary]{color:var(--color-text-tertiary)}._Textarea_bwepc_124[data-color=success]{color:var(--color-text-success)}._Textarea_bwepc_124[data-color=warning]{color:var(--color-text-warning)}._Textarea_bwepc_124[data-color=danger]{color:var(--color-text-danger)}._Textarea_bwepc_124[data-color=info]{color:var(--color-text-info)}";
var dt = Object.defineProperty, ct = Object.getOwnPropertyDescriptor, ut = (e, t, i) => t in e ? dt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, pt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? ct(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, ht = (e, t, i) => ut(e, t + "", i);
let f3 = class extends _ {
  textareaRef = k3();
  // 存储 setTimeout ID，用于清理
  timeoutId = null;
  install() {
    this.props.editable && typeof this.props.editable == "object" && this.props.editable.autoFocus && (this.timeoutId = window.setTimeout(() => {
      this.timeoutId = null;
      const e = this.textareaRef.current;
      e && (e.focus(), this.props.editable && typeof this.props.editable == "object" && this.props.editable.autoSelect && e.select());
    }, 0));
  }
  installed() {
    this.updateHostAttributes(), this.props.editable && this.adjustTextareaHeight();
  }
  updated() {
    this.updateHostAttributes(), this.props.editable && this.adjustTextareaHeight();
  }
  /**
   * 组件卸载时清理
   */
  uninstalled() {
    this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null), this.handleTextareaInput = null;
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "text");
  }
  /**
   * 调整 textarea 高度
   */
  adjustTextareaHeight() {
    const e = this.textareaRef.current;
    if (!e) return;
    e.style.height = "auto";
    const t = window.getComputedStyle(e), i = parseFloat(t.lineHeight) || 21, o = this.props.minLines ? this.props.minLines * i : i, r = e.scrollHeight;
    e.style.height = `${Math.max(r, o)}px`;
  }
  /**
   * 处理 textarea 输入
   */
  handleTextareaInput = (e) => {
    this.adjustTextareaHeight();
    const t = e.target, i = new Event("input", { bubbles: !0 });
    t.dispatchEvent(i);
  };
  /**
   * 渲染可编辑的 textarea
   */
  renderEditableText() {
    const {
      editable: e,
      value: t,
      size: i = "md",
      color: o,
      weight: r,
      textAlign: n,
      italic: a,
      lineThrough: d,
      minLines: s,
      width: l
    } = this.props;
    if (!e) return /* @__PURE__ */ c(c.f, null);
    const u = {
      ref: this.textareaRef,
      name: e.name,
      value: t || "",
      placeholder: e.placeholder || "",
      rows: 1,
      onInput: this.handleTextareaInput,
      "data-w-size": i
    };
    r && r !== "normal" && (u["data-w-weight"] = r), n && n !== "start" && (u["data-w-text-align"] = n), e.autoFocus && (u.autofocus = !0), e.required && (u.required = !0), e.disabled && (u.disabled = !0), e.autoComplete && (u.autocomplete = e.autoComplete), e.pattern && (u.pattern = e.pattern);
    const C = o ? B(o) : void 0, { style: g, dataColor: h } = C || {};
    h && (u["data-color"] = h);
    let f = g || "";
    const p = `width: ${l ? typeof l == "number" ? `${l}px` : l : "100%"};`;
    if (f = f ? `${f} ${p}` : p, s && s > 0) {
      const w = `min-height: ${s * 1.5}em;`;
      f = `${f} ${w}`;
    }
    return a && (f = `${f} font-style: italic;`), d && (f = `${f} text-decoration: line-through;`), /* @__PURE__ */ c(
      "textarea",
      {
        ...u,
        class: "_Textarea_bwepc_124 _TextBase_bwepc_1",
        style: f
      }
    );
  }
  /**
   * 渲染普通文本
   */
  renderText() {
    const {
      value: e,
      size: t = "md",
      color: i,
      weight: o,
      textAlign: r,
      italic: n,
      lineThrough: a,
      truncate: d,
      maxLines: s,
      minLines: l,
      width: u
    } = this.props, C = i ? B(i) : void 0, { style: g, dataColor: h } = C || {};
    let f = g || "";
    if (u) {
      const x = `width: ${typeof u == "number" ? `${u}px` : u};`;
      f = f ? `${f} ${x}` : x;
    }
    if (l && l > 0) {
      const x = `min-height: ${l * 1.5}em; line-height: ${1.5};`;
      f = f ? `${f} ${x}` : x;
    }
    if (n) {
      const p = "font-style: italic;";
      f = f ? `${f} ${p}` : p;
    }
    if (a) {
      const p = "text-decoration: line-through;";
      f = f ? `${f} ${p}` : p;
    }
    if (d && s && s > 1) {
      const p = `-webkit-line-clamp: ${s};`;
      f = f ? `${f} ${p}` : p;
    }
    const v = {
      "data-w-size": t
    };
    return o && o !== "normal" && (v["data-w-weight"] = o), r && r !== "start" && (v["data-w-text-align"] = r), h && (v["data-color"] = h), d && (!s || s === 1 ? v["data-w-truncate"] = !0 : v["data-w-clamp-lines"] = !0), /* @__PURE__ */ c("div", { class: "_TextBase_bwepc_1", style: f, ...v }, e);
  }
  render() {
    return this.props.editable ? this.renderEditableText() : this.renderText();
  }
};
ht(f3, "css", [S, lt]);
f3 = pt([
  y("text-widget")
], f3);
const Ct = ':host{display:inline-block;max-width:100%}.title-widget{margin:0;padding:0;font-family:var(--default-font-family);line-height:1.4;color:var(--color-text-emphasis);white-space:nowrap}.title-widget[data-size=sm]{font-size:1.125rem;line-height:1.625rem}.title-widget[data-size=md]{font-size:1.25rem;line-height:1.75rem}.title-widget[data-size=lg]{font-size:1.5rem;line-height:2rem}.title-widget[data-size=xl]{font-size:1.75rem;line-height:2.25rem}.title-widget[data-size="2xl"]{font-size:2rem;line-height:2.5rem}.title-widget[data-size="3xl"]{font-size:2.25rem;line-height:2.75rem}.title-widget[data-size="4xl"]{font-size:2.5rem;line-height:3rem}.title-widget[data-size="5xl"]{font-size:3rem;line-height:3.5rem}.title-widget[data-weight=normal]{font-weight:var(--font-weight-normal)}.title-widget[data-weight=medium]{font-weight:var(--font-weight-medium)}.title-widget[data-weight=semibold]{font-weight:var(--font-weight-semibold)}.title-widget[data-weight=bold]{font-weight:var(--font-weight-bold)}.title-widget[data-color=prose]{color:var(--color-text-prose)}.title-widget[data-color=primary]{color:var(--color-text-primary)}.title-widget[data-color=emphasis]{color:var(--color-text-emphasis)}.title-widget[data-color=secondary]{color:var(--color-text-secondary)}.title-widget[data-color=tertiary]{color:var(--color-text-tertiary)}.title-widget[data-color=success]{color:var(--color-text-success)}.title-widget[data-color=warning]{color:var(--color-text-warning)}.title-widget[data-color=danger]{color:var(--color-text-danger)}.title-widget[data-color=info]{color:var(--color-text-info)}.title-widget[data-align=start]{text-align:start}.title-widget[data-align=center]{text-align:center}.title-widget[data-align=end]{text-align:end}.title-widget[data-truncate][data-max-lines="1"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.title-widget[data-truncate]:not([data-max-lines="1"]){display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;word-break:break-word}';
var ft = Object.defineProperty, gt = Object.getOwnPropertyDescriptor, mt = (e, t, i) => t in e ? ft(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, vt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? gt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, U3 = (e, t, i) => mt(e, typeof t != "symbol" ? t + "" : t, i);
let K = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "title");
  }
  render(e) {
    const {
      value: t,
      size: i = "md",
      color: o = "prose",
      weight: r = "bold",
      textAlign: n = "start",
      truncate: a = !1,
      maxLines: d = 1
    } = e, { style: s, dataColor: l } = B(o);
    let u = s || "";
    if (a && d > 1) {
      const g = `-webkit-line-clamp: ${d};`;
      u = u ? `${u} ${g}` : g;
    }
    const C = {
      "data-size": i,
      "data-weight": r,
      "data-align": n
    };
    return l && (C["data-color"] = l), a && (C["data-truncate"] = !0, C["data-max-lines"] = d), /* @__PURE__ */ c("h3", { class: "title-widget", style: u, ...C }, t);
  }
};
U3(K, "props", {
  value: String,
  size: String,
  color: String,
  weight: String,
  textAlign: String,
  truncate: Boolean,
  maxLines: Number
});
U3(K, "css", `${S}${Ct}`);
K = vt([
  y("title-widget")
], K);
const bt = ":host{display:inline-block}.caption-widget[data-color=prose]{color:var(--color-text-prose)}.caption-widget[data-color=primary]{color:var(--color-text-primary)}.caption-widget[data-color=emphasis]{color:var(--color-text-emphasis)}.caption-widget[data-color=secondary]{color:var(--color-text-secondary)}.caption-widget[data-color=tertiary]{color:var(--color-text-tertiary)}.caption-widget[data-color=success]{color:var(--color-text-success)}.caption-widget[data-color=warning]{color:var(--color-text-warning)}.caption-widget[data-color=danger]{color:var(--color-text-danger)}.caption-widget[data-color=info]{color:var(--color-text-info)}";
var xt = Object.defineProperty, wt = Object.getOwnPropertyDescriptor, yt = (e, t, i) => t in e ? xt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, _t = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? wt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, J3 = (e, t, i) => yt(e, typeof t != "symbol" ? t + "" : t, i);
let X = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "caption");
  }
  render(e) {
    const {
      value: t,
      size: i = "md",
      color: o = "secondary",
      weight: r = "normal",
      textAlign: n = "start",
      truncate: a = !1,
      maxLines: d = 1
    } = e, { style: s, dataColor: l } = B(o);
    let u = s || "";
    if (a && d > 1) {
      const g = `-webkit-line-clamp: ${d};`;
      u = u ? `${u} ${g}` : g;
    }
    const C = {
      "data-w-size": i,
      "data-w-weight": r,
      "data-w-text-align": n
    };
    return l && (C["data-color"] = l), a && (d === 1 ? C["data-w-truncate"] = !0 : C["data-w-clamp-lines"] = !0), /* @__PURE__ */ c(
      "span",
      {
        class: "_Caption_zx847_1 caption-widget",
        style: u,
        ...C
      },
      t
    );
  }
};
J3(X, "props", {
  value: String,
  size: String,
  color: String,
  weight: String,
  textAlign: String,
  truncate: Boolean,
  maxLines: Number
});
J3(X, "css", `${S}${bt}`);
X = _t([
  y("caption-widget")
], X);
const Lt = ":host{display:inline-block}.label-widget[data-color=prose]{color:var(--color-text-prose)}.label-widget[data-color=primary]{color:var(--color-text-primary)}.label-widget[data-color=emphasis]{color:var(--color-text-emphasis)}.label-widget[data-color=secondary]{color:var(--color-text-secondary)}.label-widget[data-color=tertiary]{color:var(--color-text-tertiary)}.label-widget[data-color=success]{color:var(--color-text-success)}.label-widget[data-color=warning]{color:var(--color-text-warning)}.label-widget[data-color=danger]{color:var(--color-text-danger)}.label-widget[data-color=info]{color:var(--color-text-info)}";
var St = Object.defineProperty, Mt = Object.getOwnPropertyDescriptor, Ht = (e, t, i) => t in e ? St(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, kt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Mt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, Y3 = (e, t, i) => Ht(e, typeof t != "symbol" ? t + "" : t, i);
let Q = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "label");
  }
  render(e) {
    const {
      value: t,
      fieldName: i,
      size: o = "sm",
      color: r = "secondary",
      weight: n = "medium",
      textAlign: a = "start"
    } = e, { style: d, dataColor: s } = B(r), l = {
      "data-w-size": o,
      "data-w-weight": n,
      "data-w-text-align": a
    };
    return s && (l["data-color"] = s), /* @__PURE__ */ c(
      "label",
      {
        class: "_Label_iayuy_1 label-widget",
        for: i,
        style: d || "",
        ...l
      },
      t
    );
  }
};
Y3(Q, "props", {
  value: String,
  fieldName: String,
  size: String,
  color: String,
  weight: String,
  textAlign: String
});
Y3(Q, "css", `${S}${Lt}`);
Q = kt([
  y("label-widget")
], Q);
const zt = ":host{display:inline-block}";
var At = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, $t = (e, t, i) => t in e ? At(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Zt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Vt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, G3 = (e, t, i) => $t(e, typeof t != "symbol" ? t + "" : t, i);
let t3 = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "badge");
  }
  render(e) {
    const {
      label: t,
      color: i = "secondary",
      variant: o = "soft",
      size: r = "sm",
      pill: n = !1
    } = e, a = {
      "data-color": i,
      "data-variant": o,
      "data-size": r
    };
    return n && (a["data-pill"] = !0), /* @__PURE__ */ c("span", { class: "_Badge_9os74_1 badge-widget", ...a }, t);
  }
};
G3(t3, "props", {
  label: String,
  color: String,
  variant: String,
  size: String,
  pill: Boolean
});
G3(t3, "css", `${S}${zt}`);
t3 = Zt([
  y("badge-widget")
], t3);
const Rt = ":host{display:inline-block;min-width:0;min-height:0}.image-widget{display:block;border-radius:var(--radius-default);min-width:1px;min-height:1px}.image-widget[data-w-frame]{border:1px solid var(--color-border)}.image-widget[data-w-flush]{border-radius:0}";
var Dt = Object.defineProperty, Tt = Object.getOwnPropertyDescriptor, Pt = (e, t, i) => t in e ? Dt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Bt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Tt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, K3 = (e, t, i) => Pt(e, typeof t != "symbol" ? t + "" : t, i);
let e3 = class extends _ {
  imageLoaded = !1;
  installed() {
    this.updateHostAttributes(), this.handleImageLoad();
  }
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "image");
  }
  handleImageLoad() {
    const e = this.shadowRoot?.querySelector("img");
    e && (e.complete ? (this.imageLoaded = !0, this.update()) : e.addEventListener("load", () => {
      this.imageLoaded = !0, this.update();
    }));
  }
  render(e) {
    const {
      src: t,
      alt: i = "",
      frame: o = !1,
      fit: r = "cover",
      position: n = "center",
      flush: a = !1,
      width: d,
      height: s,
      size: l,
      minWidth: u,
      minHeight: C,
      minSize: g,
      maxWidth: h,
      maxHeight: f,
      maxSize: v,
      aspectRatio: p,
      radius: x,
      margin: w
    } = e, k = D3(
      {
        width: d,
        height: s,
        size: l,
        minWidth: u,
        minHeight: C,
        minSize: g,
        maxWidth: h,
        maxHeight: f,
        maxSize: v,
        aspectRatio: p,
        radius: x,
        margin: w
      },
      1
    ), m = I(
      r ? { objectFit: r } : void 0,
      n ? { objectPosition: n } : void 0
    );
    let L = I(k, m);
    !d && !s && !l && !u && !C && !g && !h && !f && !v ? L = I(L, {
      display: "block",
      width: "100%",
      height: "auto"
    }) : !s && !l && !C && !p && (L = I(L, {
      height: "auto"
    }));
    const Z = {};
    return this.imageLoaded && (Z["data-loaded"] = !0), o && (Z["data-w-frame"] = !0), a && (Z["data-w-flush"] = !0), /* @__PURE__ */ c(
      "img",
      {
        class: "_Image_nc5o2_1 image-widget",
        src: t,
        alt: i,
        style: L,
        ...Z
      }
    );
  }
};
K3(e3, "props", {
  src: String,
  alt: String,
  frame: Boolean,
  fit: String,
  position: String,
  flush: Boolean,
  width: [Number, String],
  height: [Number, String],
  size: [Number, String],
  minWidth: [Number, String],
  minHeight: [Number, String],
  minSize: [Number, String],
  maxWidth: [Number, String],
  maxHeight: [Number, String],
  maxSize: [Number, String],
  aspectRatio: [Number, String],
  radius: String,
  margin: [Number, String, Object]
});
K3(e3, "css", `${S}${Rt}`);
e3 = Bt([
  y("image-widget")
], e3);
const Et = ':host{display:block;box-sizing:border-box;max-width:100%;min-width:260px}:host([data-size="sm"]){width:260px}:host([data-size="md"]){width:320px}:host([data-size="lg"]){width:480px}:host(:not([data-size])){width:100%}.video-container{position:relative;width:100%;padding-top:56.25%;overflow:hidden;border-radius:var(--radius-default)}.video-container[data-aspect-ratio="16:9"]{padding-top:56.25%}.video-container[data-aspect-ratio="9:16"]{padding-top:177.78%}.video-container[data-aspect-ratio="4:3"]{padding-top:75%}.video-container[data-aspect-ratio="3:4"]{padding-top:133.33%}.video-widget{position:absolute;top:0;left:0;width:100%;height:100%;border:none;outline:none}';
var It = Object.defineProperty, Ot = Object.getOwnPropertyDescriptor, Ft = (e, t, i) => t in e ? It(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Nt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ot(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, jt = (e, t, i) => Ft(e, t + "", i);
let g3 = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    e.setAttribute("data-w-component", "video");
    const { size: t } = this.props;
    t ? e.setAttribute("data-size", t) : e.removeAttribute("data-size");
  }
  render(e) {
    const { src: t, poster: i, aspectRatio: o = "16:9" } = e, r = {
      class: "video-container",
      "data-aspect-ratio": o
    }, n = {
      src: t,
      class: "video-widget",
      controls: !0
    };
    return i && (n.poster = i), /* @__PURE__ */ c("div", { ...r }, /* @__PURE__ */ c("video", { ...n }));
  }
};
jt(g3, "css", Et);
g3 = Nt([
  y("video-widget")
], g3);
const qt = ':host{display:block;box-sizing:border-box;max-width:100%;min-width:260px}:host([data-size="sm"]){width:260px}:host([data-size="md"]){width:320px}:host([data-size="lg"]){width:480px}:host(:not([data-size])){width:100%}.audio-widget{display:block;width:100%}';
var Wt = Object.defineProperty, Ut = Object.getOwnPropertyDescriptor, Jt = (e, t, i) => t in e ? Wt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Yt = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ut(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, Gt = (e, t, i) => Jt(e, t + "", i);
let m3 = class extends _ {
  installed() {
    this.updateHostAttributes();
  }
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    e.setAttribute("data-w-component", "audio");
    const { size: t } = this.props;
    t ? e.setAttribute("data-size", t) : e.removeAttribute("data-size");
  }
  render(e) {
    const { src: t } = e;
    return /* @__PURE__ */ c("audio", { ...{
      src: t,
      class: "audio-widget",
      controls: !0
    } });
  }
};
Gt(m3, "css", qt);
m3 = Yt([
  y("audio-widget")
], m3);
const Kt = ".countdown-widget{display:inline-flex;align-items:center;gap:calc(var(--spacing) * 1);font-family:var(--default-font-family);font-variant-numeric:tabular-nums}.countdown-widget.countdown-xs{font-size:var(--font-text-xs-size);line-height:var(--font-text-xs-line-height);letter-spacing:var(--font-text-xs-tracking)}.countdown-widget.countdown-sm{font-size:var(--font-text-sm-size);line-height:var(--font-text-sm-line-height);letter-spacing:var(--font-text-sm-tracking)}.countdown-widget.countdown-md{font-size:var(--font-text-md-size);line-height:var(--font-text-md-line-height);letter-spacing:var(--font-text-md-tracking)}.countdown-widget.countdown-lg{font-size:var(--font-text-lg-size);line-height:var(--font-text-lg-line-height);letter-spacing:var(--font-text-lg-tracking)}.countdown-widget.countdown-xl{font-size:var(--font-text-xl-size);line-height:var(--font-text-xl-line-height);letter-spacing:var(--font-text-xl-tracking)}.countdown-icon{width:1em;height:1em;flex-shrink:0}.countdown-text{color:inherit}.countdown-widget{color:var(--color-text-primary);font-weight:var(--font-weight-medium)}.countdown-widget[data-color=prose]{color:var(--color-text-prose)}.countdown-widget[data-color=primary]{color:var(--color-text-primary)}.countdown-widget[data-color=emphasis]{color:var(--color-text-emphasis)}.countdown-widget[data-color=secondary]{color:var(--color-text-secondary)}.countdown-widget[data-color=tertiary]{color:var(--color-text-tertiary)}.countdown-widget[data-color=success]{color:var(--color-text-success)}.countdown-widget[data-color=warning]{color:var(--color-text-warning)}.countdown-widget[data-color=danger]{color:var(--color-text-danger)}.countdown-widget[data-color=info]{color:var(--color-text-info)}.countdown-widget.countdown-finished{color:var(--color-text-disabled)}";
var Xt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, te = (e, t, i) => t in e ? Xt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, ee = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Qt(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, X3 = (e, t, i) => te(e, typeof t != "symbol" ? t + "" : t, i);
const i3 = /* @__PURE__ */ new Set();
function H3() {
  Array.from(i3).forEach((t) => {
    t.isUnmounted || t.cleanup();
  }), i3.clear();
}
let r3 = class extends _ {
  remainingSeconds = 0;
  initialDuration = 0;
  // 保存初始的 duration，用于检测 props 变化
  timerId = null;
  isFinished = !1;
  isStopped = !1;
  // 标记是否被暂停
  isUnmounted = !1;
  // 标记组件是否已卸载（public，供外部清理函数访问）
  formElement = null;
  formSubmitHandler = null;
  installed() {
    this.updateHostAttributes(), i3.add(this), this.isUnmounted = !1, this.isFinished = !1, this.isStopped = !1, this.timerId = null, this.formElement = null, this.formSubmitHandler = null, this.initialDuration = this.props.duration || 0, this.remainingSeconds = this.initialDuration, this.isFinished = this.remainingSeconds <= 0, setTimeout(() => {
      if (this.isUnmounted)
        return;
      const e = this.shadowRoot?.host;
      this.formElement = m1(e), this.formElement && (this.formSubmitHandler = () => {
        this.timerId !== null && this.stopCountdown();
      }, this.formElement.addEventListener(
        "form-submit-success",
        this.formSubmitHandler
      ));
    }, 0), this.remainingSeconds > 0 && this.startCountdown();
  }
  beforeUpdate() {
    this.updateHostAttributes();
    const e = this.props.duration || 0;
    e !== this.initialDuration && !this.isUnmounted && (this.stopCountdown(), this.initialDuration = e, this.remainingSeconds = e, this.isFinished = !1, this.isStopped = !1, this.remainingSeconds > 0 && this.startCountdown());
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && e.setAttribute("data-w-component", "countdown");
  }
  // 🔥 统一的清理方法，可以被 uninstalled() 调用
  // 🔥 改为 public，允许外部调用（如 adp-widget 重新渲染时）
  cleanup() {
    this.isUnmounted = !0, i3.delete(this), this.stopCountdown(), this.formElement && this.formSubmitHandler && (this.formElement.removeEventListener(
      "form-submit-success",
      this.formSubmitHandler
    ), this.formSubmitHandler = null, this.formElement = null);
  }
  uninstalled() {
    this.cleanup();
  }
  startCountdown() {
    this.stopCountdown(), this.timerId = window.setInterval(() => {
      if (this.isUnmounted) {
        this.stopCountdown();
        return;
      }
      this.remainingSeconds--, this.remainingSeconds <= 0 && (this.remainingSeconds = 0, this.isFinished = !0, this.stopCountdown(), this.triggerComplete()), this.update();
    }, 1e3);
  }
  stopCountdown() {
    this.timerId !== null && (window.clearInterval(this.timerId), this.timerId = null, this.isStopped = !0, this.isUnmounted || this.update());
  }
  triggerComplete() {
    if (this.isUnmounted)
      return;
    const { onCompleteAction: e, onAction: t } = this.props;
    if (e && t) {
      let i = { ...e.payload };
      if (this.formElement)
        try {
          i = { ...E(this.formElement), ...e.payload };
        } catch (o) {
          console.error("[Countdown] Failed to collect form data:", o);
        }
      t({
        type: e.type,
        payload: i
      });
    }
  }
  /**
   * 格式化时间显示
   * 根据剩余秒数自动选择合适的格式
   */
  formatTime(e) {
    if (e <= 0)
      return "00:00";
    const t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), o = e % 60, r = (n) => n.toString().padStart(2, "0");
    return t > 0 ? `${r(t)}:${r(i)}:${r(o)}` : `${r(i)}:${r(o)}`;
  }
  render(e) {
    const { prefix: t, suffix: i, size: o = "md", color: r } = e, n = [
      "countdown-widget",
      `countdown-${o}`,
      // 结束或暂停状态都应用置灰样式
      this.isFinished || this.isStopped ? "countdown-finished" : ""
    ].filter(Boolean).join(" "), a = r ? B(r) : void 0, { style: d, dataColor: s } = a || {}, l = /* @__PURE__ */ c(
      "svg",
      {
        class: "countdown-icon",
        viewBox: "0 0 16 16",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      },
      /* @__PURE__ */ c(
        "circle",
        {
          cx: "8",
          cy: "8",
          r: "6.5",
          stroke: "currentColor",
          "stroke-width": "1.2"
        }
      ),
      /* @__PURE__ */ c(
        "path",
        {
          d: "M8 4.5V8L10.5 10",
          stroke: "currentColor",
          "stroke-width": "1.2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }
      )
    ), u = {};
    return s && (u["data-color"] = s), /* @__PURE__ */ c("div", { class: n, style: d || "", ...u }, t && /* @__PURE__ */ c("span", { class: "countdown-text" }, t), l, /* @__PURE__ */ c("span", { class: "countdown-text" }, this.formatTime(this.remainingSeconds)), i && /* @__PURE__ */ c("span", { class: "countdown-text" }, i));
  }
};
X3(r3, "css", Kt);
X3(r3, "props", {
  duration: Number,
  prefix: String,
  suffix: String,
  size: String,
  color: [String, Object],
  onCompleteAction: Object,
  onAction: Function
});
r3 = ee([
  y("countdown-widget")
], r3);
const ie = ":host{display:inline-block;--tg-will-change: var(--Transition-will-change, var(--controls-will-change, auto));--tg-enter-opacity: var(--Transition-enter-opacity, var(--controls-enter-opacity, 1));--tg-enter-transform: var(--Transition-enter-transform, var(--controls-enter-transform, none));--tg-enter-filter: var(--Transition-enter-filter, var(--controls-enter-filter, none));--tg-enter-duration: var(--Transition-enter-duration, var(--controls-enter-duration, var(--transition-duration-basic, .15s)));--tg-enter-delay: var(--Transition-enter-delay, var(--controls-enter-delay, 0ms));--tg-enter-timing-function: var(--Transition-enter-timing-function, var(--controls-enter-timing-function, var(--transition-ease-basic, ease)));--tg-exit-opacity: var(--Transition-exit-opacity, var(--controls-exit-opacity, 0));--tg-exit-transform: var(--Transition-exit-transform, var(--controls-exit-transform, none));--tg-exit-filter: var(--Transition-exit-filter, var(--controls-exit-filter, none));--tg-exit-duration: var(--Transition-exit-duration, var(--controls-exit-duration, var(--transition-duration-basic, .15s)));--tg-exit-delay: var(--Transition-exit-delay, var(--controls-exit-delay, 0ms));--tg-exit-timing-function: var(--Transition-exit-timing-function, var(--controls-exit-timing-function, var(--transition-ease-basic, ease)));--tg-initial-opacity: var(--Transition-initial-opacity, var(--controls-initial-opacity, 0));--tg-initial-transform: var(--Transition-initial-transform, var(--controls-initial-transform, none));--tg-initial-filter: var(--Transition-initial-filter, var(--controls-initial-filter, none))}:host ._TransitionItem_1iiup_40{will-change:var(--tg-will-change)}:host ._TransitionItem_1iiup_40[data-entering]{filter:var(--tg-initial-filter);opacity:var(--tg-initial-opacity);transform:var(--tg-initial-transform)}:host ._TransitionItem_1iiup_40[data-exiting]{filter:var(--tg-enter-filter);opacity:var(--tg-enter-opacity);transform:var(--tg-enter-transform)}:host ._TransitionItem_1iiup_40[data-entering-active],:host ._TransitionItem_1iiup_40[data-entering][data-interrupted]{filter:var(--tg-enter-filter);opacity:var(--tg-enter-opacity);transform:var(--tg-enter-transform);transition:opacity var(--tg-enter-duration) var(--tg-enter-timing-function) var(--tg-enter-delay),transform var(--tg-enter-duration) var(--tg-enter-timing-function) var(--tg-enter-delay),filter var(--tg-enter-duration) var(--tg-enter-timing-function) var(--tg-enter-delay)}:host ._TransitionItem_1iiup_40[data-exiting-active],:host ._TransitionItem_1iiup_40[data-exiting][data-interrupted]{filter:var(--tg-exit-filter);opacity:var(--tg-exit-opacity);transform:var(--tg-exit-transform);transition:opacity var(--tg-exit-duration) var(--tg-exit-timing-function) var(--tg-exit-delay),transform var(--tg-exit-duration) var(--tg-exit-timing-function) var(--tg-exit-delay),filter var(--tg-exit-duration) var(--tg-exit-timing-function) var(--tg-exit-delay)}:host ._TransitionItem_1iiup_40[data-entering][data-interrupted],:host ._TransitionItem_1iiup_40[data-exiting][data-interrupted]{transition-delay:0ms}";
var re = Object.defineProperty, oe = Object.getOwnPropertyDescriptor, ne = (e, t, i) => t in e ? re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, ae = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? oe(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, Q3 = (e, t, i) => ne(e, typeof t != "symbol" ? t + "" : t, i);
let o3 = class extends _ {
  render(e) {
    const { children: t } = e;
    return /* @__PURE__ */ c("span", { class: "_TransitionItem_1iiup_40 _TransitionGroupChild_1d6a5_1" }, t);
  }
};
Q3(o3, "props", {
  children: Object
});
Q3(o3, "css", `${S}${ie}`);
o3 = ae([
  y("transition-widget")
], o3);
const se = ":host{--radius-default: 8px;--radius-card: 24px;--radius-full: 9999px;--size-3xs: 22px;--size-2xs: 24px;--size-xs: 26px;--size-sm: 28px;--size-md: 32px;--size-lg: 36px;--size-xl: 40px;--size-2xl: 44px;--size-3xl: 48px;--font-size-xs: 10px;--font-size-sm: 12px;--font-size-md: 14px;--font-size-lg: 16px;--icon-size-xs: 12px;--icon-size-sm: 14px;--icon-size-md: 16px;--icon-size-lg: 18px;--icon-size-xl: 20px;--icon-size-2xl: 24px;--icon-size-3xl: 32px;--padding-xs: 4px;--padding-sm: 8px;--padding-md: 10px;--padding-lg: 12px;--padding-xl: 14px;--padding-2xl: 16px;--font-weight-normal: 400;--font-weight-medium: 500;--font-weight-semibold: 600;--font-weight-bold: 700;--transition-fast: .1s;--transition-base: .2s;--transition-slow: .3s;--color-disabled: #d4d4d4;--color-disabled-light: #e5e5e5;--color-hover-overlay: rgba(0, 0, 0, .06);--color-divider: rgba(0, 0, 0, .1);--color-divider-dark: rgba(255, 255, 255, .1);--divider-spacing: 8px;--variant-soft-bg: #f5f5f5;--variant-soft-bg-hover: #eeeeee;--variant-soft-border: transparent;--variant-soft-border-hover: #999999;--variant-outline-bg: transparent;--variant-outline-bg-hover: transparent;--variant-outline-border: #d9d9d9;--variant-outline-border-hover: #999999;--color-primary: #1a1a1a;--color-primary-hover: #333333;--color-primary-active: #000000;--color-primary-disabled: #cccccc;--color-primary-light: rgba(26, 26, 26, .1);--color-info: #0052d9;--color-info-hover: #266fe8;--color-info-active: #0034a6;--color-info-disabled: #b3d4ff;--color-info-light: rgba(0, 82, 217, .1);--color-discovery: #924ff7;--color-discovery-hover: #a66ff9;--color-discovery-active: #8046d9;--color-discovery-disabled: #dcc5fb;--color-discovery-light: rgba(146, 79, 247, .1);--color-caution: #f5c518;--color-caution-hover: #f7d147;--color-caution-active: #d9ae14;--color-caution-disabled: #fbefc6;--color-caution-light: rgba(245, 197, 24, .1);--color-warning: #ed7b2f;--color-warning-hover: #f0954f;--color-warning-active: #d96c28;--color-warning-disabled: #f7d4b8;--color-warning-light: rgba(237, 123, 47, .1);--color-success: #00a870;--color-success-hover: #2bb889;--color-success-active: #008858;--color-success-disabled: #b3e5d2;--color-success-light: rgba(0, 168, 112, .1);--color-danger: #e34d59;--color-danger-hover: #e8707a;--color-danger-active: #c9353f;--color-danger-disabled: #f5c1c6;--color-danger-light: rgba(227, 77, 89, .1);--color-secondary: #666666;--color-secondary-hover: #808080;--color-secondary-active: #4d4d4d;--color-secondary-disabled: #d9d9d9;--color-secondary-light: rgba(102, 102, 102, .1);--color-tertiary: #999999;--color-tertiary-hover: #b3b3b3;--color-tertiary-active: #808080;--color-tertiary-disabled: #e6e6e6;--color-tertiary-light: rgba(153, 153, 153, .1);--color-prose: #1a1a1a;--color-emphasis: #1a1a1a;--color-gray-50: #fafafa;--color-gray-100: #f5f5f5;--color-gray-200: #e5e5e5;--color-gray-300: #d4d4d4;--color-gray-400: #a3a3a3;--color-gray-500: #737373;--color-gray-600: #525252;--color-gray-700: #404040;--color-gray-800: #262626;--color-gray-900: #171717;--color-red-50: #fef2f2;--color-red-100: #fee2e2;--color-red-200: #fecaca;--color-red-300: #fca5a5;--color-red-400: #f87171;--color-red-500: #ef4444;--color-red-600: #dc2626;--color-red-700: #b91c1c;--color-red-800: #991b1b;--color-red-900: #7f1d1d;--color-orange-50: #fff7ed;--color-orange-100: #ffedd5;--color-orange-200: #fed7aa;--color-orange-300: #fdba74;--color-orange-400: #fb923c;--color-orange-500: #f97316;--color-orange-600: #ea580c;--color-orange-700: #c2410c;--color-orange-800: #9a3412;--color-orange-900: #7c2d12;--color-yellow-50: #fefce8;--color-yellow-100: #fef9c3;--color-yellow-200: #fef08a;--color-yellow-300: #fde047;--color-yellow-400: #facc15;--color-yellow-500: #eab308;--color-yellow-600: #ca8a04;--color-yellow-700: #a16207;--color-yellow-800: #854d0e;--color-yellow-900: #713f12;--color-green-50: #f0fdf4;--color-green-100: #dcfce7;--color-green-200: #bbf7d0;--color-green-300: #86efac;--color-green-400: #4ade80;--color-green-500: #22c55e;--color-green-600: #16a34a;--color-green-700: #15803d;--color-green-800: #166534;--color-green-900: #14532d;--color-blue-50: #eff6ff;--color-blue-100: #dbeafe;--color-blue-200: #bfdbfe;--color-blue-300: #93c5fd;--color-blue-400: #60a5fa;--color-blue-500: #3b82f6;--color-blue-600: #2563eb;--color-blue-700: #1d4ed8;--color-blue-800: #1e40af;--color-blue-900: #1e3a8a;--color-purple-50: #faf5ff;--color-purple-100: #f3e8ff;--color-purple-200: #e9d5ff;--color-purple-300: #d8b4fe;--color-purple-400: #c084fc;--color-purple-500: #a855f7;--color-purple-600: #9333ea;--color-purple-700: #7e22ce;--color-purple-800: #6b21a8;--color-purple-900: #581c87;--color-pink-50: #fdf2f8;--color-pink-100: #fce7f3;--color-pink-200: #fbcfe8;--color-pink-300: #f9a8d4;--color-pink-400: #f472b6;--color-pink-500: #ec4899;--color-pink-600: #db2777;--color-pink-700: #be185d;--color-pink-800: #9d174d;--color-pink-900: #831843;--color-teal-50: #f0fdfa;--color-teal-100: #ccfbf1;--color-teal-200: #99f6e4;--color-teal-300: #5eead4;--color-teal-400: #2dd4bf;--color-teal-500: #14b8a6;--color-teal-600: #0d9488;--color-teal-700: #0f766e;--color-teal-800: #115e59;--color-teal-900: #134e4a;--color-indigo-50: #eef2ff;--color-indigo-100: #e0e7ff;--color-indigo-200: #c7d2fe;--color-indigo-300: #a5b4fc;--color-indigo-400: #818cf8;--color-indigo-500: #6366f1;--color-indigo-600: #4f46e5;--color-indigo-700: #4338ca;--color-indigo-800: #3730a3;--color-indigo-900: #312e81}";
class le {
  render(t, i, o) {
    const r = {};
    return t.size !== void 0 && (r.size = t.size), t.padding !== void 0 && (r.padding = t.padding), t.background !== void 0 && (r.background = t.background), t.theme !== void 0 && (r.theme = t.theme), t.status !== void 0 && (r.status = t.status), t.collapsed !== void 0 && (r.collapsed = t.collapsed), t.asForm !== void 0 && (r.asForm = t.asForm), t.confirm && o && (r.confirm = {
      label: t.confirm.label,
      onAction: P3(t.confirm.action, o),
      action: t.confirm.action
      // 保留原始 action 配置
    }), t.cancel && o && (r.cancel = {
      label: t.cancel.label,
      onAction: () => o(t.cancel.action),
      action: t.cancel.action
      // 保留原始 action 配置
    }), {
      tag: "card-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      // 渲染子组件（由编译器自动处理）
      children: i ? t.children?.map((n) => i(n)) || [] : []
    };
  }
}
class de {
  render(t, i, o) {
    const r = {
      limit: t.limit,
      status: t.status
    }, n = t.children?.map((a) => i?.(a)).filter(Boolean) || [];
    return {
      tag: "listview-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: n
    };
  }
}
class ce {
  render(t, i, o) {
    const r = t.gap ? C1(t.gap) : "12px", n = !!t.onClickAction, a = n && o ? () => {
      o(t.onClickAction);
    } : void 0;
    return {
      tag: "listviewitem-widget",
      props: {
        gap: r,
        align: t.align || "center",
        hasAction: n,
        onClick: a
      },
      children: i ? t.children?.map((d) => i(d)) || [] : []
    };
  }
}
class ue {
  render(t, i) {
    const o = {
      // 默认值
      align: "start",
      justify: "start"
    };
    return t.direction !== void 0 && (o.direction = t.direction), t.align !== void 0 && (o.align = t.align), t.justify !== void 0 && (o.justify = t.justify), t.gap !== void 0 && (o.gap = t.gap), t.padding !== void 0 && (o.padding = t.padding), {
      tag: "box-widget",
      // 复用 box-widget，不创建新的 tag
      props: o,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: i ? t.children?.map((r) => i(r)) || [] : []
    };
  }
}
class pe {
  render(t, i) {
    const o = {
      // 默认值
      align: "start",
      justify: "start"
    };
    return t.direction !== void 0 && (o.direction = t.direction), t.align !== void 0 && (o.align = t.align), t.justify !== void 0 && (o.justify = t.justify), t.wrap !== void 0 && (o.wrap = t.wrap), t.gap !== void 0 && (o.gap = t.gap), t.padding !== void 0 && (o.padding = t.padding), t.border !== void 0 && (o.border = t.border), t.background !== void 0 && (o.background = t.background), t.flex !== void 0 && (o.flex = t.flex), t.width !== void 0 && (o.width = t.width), t.height !== void 0 && (o.height = t.height), t.size !== void 0 && (o.size = t.size), t.minWidth !== void 0 && (o.minWidth = t.minWidth), t.minHeight !== void 0 && (o.minHeight = t.minHeight), t.minSize !== void 0 && (o.minSize = t.minSize), t.maxWidth !== void 0 && (o.maxWidth = t.maxWidth), t.maxHeight !== void 0 && (o.maxHeight = t.maxHeight), t.maxSize !== void 0 && (o.maxSize = t.maxSize), t.aspectRatio !== void 0 && (o.aspectRatio = t.aspectRatio), t.radius !== void 0 && (o.radius = t.radius), t.margin !== void 0 && (o.margin = t.margin), {
      tag: "box-widget",
      props: o,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: i ? t.children?.map((r) => i(r)) || [] : []
    };
  }
}
class he {
  render(t, i) {
    const o = {
      direction: "row"
      // Row 固定为 row 方向
      // 移除默认的 align 和 justify，让 Box 组件来处理默认值
      // Row 的默认 align 会在 Box 组件中设置为 'center'
    };
    return t.align !== void 0 && (o.align = t.align), t.justify !== void 0 && (o.justify = t.justify), t.wrap !== void 0 && (o.wrap = t.wrap), t.gap !== void 0 && (o.gap = t.gap), t.padding !== void 0 && (o.padding = t.padding), t.border !== void 0 && (o.border = t.border), t.background !== void 0 && (o.background = t.background), t.flex !== void 0 && (o.flex = t.flex), t.width !== void 0 && (o.width = t.width), t.height !== void 0 && (o.height = t.height), t.size !== void 0 && (o.size = t.size), t.minWidth !== void 0 && (o.minWidth = t.minWidth), t.minHeight !== void 0 && (o.minHeight = t.minHeight), t.minSize !== void 0 && (o.minSize = t.minSize), t.maxWidth !== void 0 && (o.maxWidth = t.maxWidth), t.maxHeight !== void 0 && (o.maxHeight = t.maxHeight), t.maxSize !== void 0 && (o.maxSize = t.maxSize), t.aspectRatio !== void 0 && (o.aspectRatio = t.aspectRatio), t.radius !== void 0 && (o.radius = t.radius), t.margin !== void 0 && (o.margin = t.margin), {
      tag: "box-widget",
      // 复用 box-widget
      props: o,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: i ? t.children?.map((r) => i(r)) || [] : []
    };
  }
}
class Ce {
  render(t, i) {
    const o = {};
    return t.align !== void 0 && (o.align = t.align), t.justify !== void 0 && (o.justify = t.justify), t.wrap !== void 0 && (o.wrap = t.wrap), t.gap !== void 0 && (o.gap = t.gap), t.padding !== void 0 && (o.padding = t.padding), t.border !== void 0 && (o.border = t.border), t.background !== void 0 && (o.background = t.background), t.flex !== void 0 && (o.flex = t.flex), t.width !== void 0 && (o.width = t.width), t.height !== void 0 && (o.height = t.height), t.size !== void 0 && (o.size = t.size), t.minWidth !== void 0 && (o.minWidth = t.minWidth), t.minHeight !== void 0 && (o.minHeight = t.minHeight), t.minSize !== void 0 && (o.minSize = t.minSize), t.maxWidth !== void 0 && (o.maxWidth = t.maxWidth), t.maxHeight !== void 0 && (o.maxHeight = t.maxHeight), t.maxSize !== void 0 && (o.maxSize = t.maxSize), t.aspectRatio !== void 0 && (o.aspectRatio = t.aspectRatio), t.radius !== void 0 && (o.radius = t.radius), t.margin !== void 0 && (o.margin = t.margin), o.direction = "col", {
      tag: "box-widget",
      // 复用 box-widget，不创建新的 col-widget
      props: o,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: i ? t.children?.map((r) => i(r)) || [] : []
    };
  }
}
class fe {
  render(t, i, o) {
    const r = {
      // 默认值
      align: "start",
      justify: "start"
    };
    return t.direction !== void 0 && (r.direction = t.direction), t.align !== void 0 && (r.align = t.align), t.justify !== void 0 && (r.justify = t.justify), t.wrap !== void 0 && (r.wrap = t.wrap), t.gap !== void 0 && (r.gap = t.gap), t.padding !== void 0 && (r.padding = t.padding), t.border !== void 0 && (r.border = t.border), t.background !== void 0 && (r.background = t.background), t.flex !== void 0 && (r.flex = t.flex), t.width !== void 0 && (r.width = t.width), t.height !== void 0 && (r.height = t.height), t.size !== void 0 && (r.size = t.size), t.minWidth !== void 0 && (r.minWidth = t.minWidth), t.minHeight !== void 0 && (r.minHeight = t.minHeight), t.minSize !== void 0 && (r.minSize = t.minSize), t.maxWidth !== void 0 && (r.maxWidth = t.maxWidth), t.maxHeight !== void 0 && (r.maxHeight = t.maxHeight), t.maxSize !== void 0 && (r.maxSize = t.maxSize), t.aspectRatio !== void 0 && (r.aspectRatio = t.aspectRatio), t.radius !== void 0 && (r.radius = t.radius), t.margin !== void 0 && (r.margin = t.margin), t.onClickAction && (r.actionConfig = t.onClickAction, o && (r.onClickAction = () => {
      o(t.onClickAction);
    })), t.disabled !== void 0 && (r.disabled = t.disabled), {
      tag: "clickable-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: i ? t.children?.map((n) => i(n)) || [] : []
    };
  }
}
var ge = Object.defineProperty, me = Object.getOwnPropertyDescriptor, ve = (e, t, i) => t in e ? ge(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, be = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? me(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, h3 = (e, t, i) => ve(e, typeof t != "symbol" ? t + "" : t, i);
let M = class extends _ {
  formRef = null;
  submitHandler = null;
  /**
   * 组件安装后，设置表单提交处理
   */
  installed() {
    this.updateHostAttributes(), setTimeout(() => {
      this.setupFormHandler();
    }, 0);
  }
  /**
   * 组件更新后，确保处理器已设置
   */
  updated() {
    this.updateHostAttributes(), this.setupFormHandler();
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    e.setAttribute("data-w-component", "form");
    const t = this.props.direction || "col";
    e.setAttribute("data-w-direction", t), this.props.gap === void 0 ? e.setAttribute("data-w-auto-spacing", "") : e.removeAttribute("data-w-auto-spacing");
  }
  /**
   * 组件卸载前，清理事件监听器
   */
  uninstall() {
    this.formRef && this.submitHandler && this.formRef.removeEventListener("submit", this.submitHandler);
  }
  /**
   * 设置表单提交处理器
   */
  setupFormHandler() {
    if (!this.formRef) return;
    const e = this.formRef;
    this.submitHandler && e.removeEventListener("submit", this.submitHandler), this.submitHandler = (t) => {
      t.preventDefault(), M.hideAllValidationTooltips(e);
      const i = M.validateRequiredFields(e);
      if (!i.valid && i.firstInvalidElement) {
        M.showValidationTooltip(
          i.firstInvalidElement,
          i.message || b("form.required")
        );
        return;
      }
      const o = E(e), r = new CustomEvent("form-submit-success", {
        bubbles: !0
      });
      e.dispatchEvent(r), this.props.onSubmitAction && this.props.onSubmitAction(o), this.fire("formsubmit", o);
    }, e.addEventListener("submit", this.submitHandler);
  }
  /**
   * 验证表单中的 required 字段和 pattern 正则验证
   */
  static validateRequiredFields(e) {
    const t = (o) => {
      const r = o.getAttribute("data-required") === "true", n = o.getAttribute("data-input-type"), a = o.getAttribute("data-pattern"), d = o.tagName.toLowerCase();
      if (d === "input-widget") {
        const s = P(o), l = typeof s == "string" ? s.trim() : "";
        if (r && !l)
          return {
            valid: !1,
            firstInvalidElement: o,
            message: b("form.required")
          };
        if (n === "email" && l && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l))
          return {
            valid: !1,
            firstInvalidElement: o,
            message: b("form.invalidEmail")
          };
        if (a && l)
          try {
            if (!new RegExp(a).test(l))
              return {
                valid: !1,
                firstInvalidElement: o,
                message: b("form.invalidFormat")
              };
          } catch (u) {
            console.warn("Invalid pattern regex:", a, u);
          }
      }
      if (d === "textarea-widget") {
        const s = o.value || "", l = typeof s == "string" ? s.trim() : "";
        if (r && !l)
          return {
            valid: !1,
            firstInvalidElement: o,
            message: b("form.required")
          };
        if (a && l)
          try {
            if (!new RegExp(a).test(l))
              return {
                valid: !1,
                firstInvalidElement: o,
                message: b("form.invalidFormat")
              };
          } catch (u) {
            console.warn("Invalid pattern regex:", a, u);
          }
      }
      if (d === "checkbox-widget" && r) {
        let s = !1;
        if (o.shadowRoot) {
          const l = o.shadowRoot.querySelector(
            'input[type="checkbox"]'
          );
          l instanceof HTMLInputElement && (s = l.checked);
        }
        if (!s && "checked" in o && (s = !!o.checked), !s)
          return {
            valid: !1,
            firstInvalidElement: o,
            message: b("form.checkRequired")
          };
      }
      if (d === "radiogroup-widget" && r) {
        const s = P(o);
        if (!(typeof s == "string" ? s.trim() : ""))
          return {
            valid: !1,
            firstInvalidElement: o,
            message: b("form.selectRequired")
          };
      }
      if (d === "image-select-widget" && r) {
        const s = P(o);
        if (!(typeof s == "string" ? s.trim() : ""))
          return {
            valid: !1,
            firstInvalidElement: o,
            message: "请选择图片"
          };
      }
      if (d === "slot" && o instanceof HTMLSlotElement) {
        const s = o.assignedElements();
        for (const l of s) {
          const u = t(l);
          if (u && !u.valid)
            return u;
        }
      }
      for (const s of Array.from(o.children)) {
        const l = t(s);
        if (l && !l.valid)
          return l;
      }
      if (o.shadowRoot)
        for (const s of Array.from(o.shadowRoot.children)) {
          const l = t(s);
          if (l && !l.valid)
            return l;
        }
      return null;
    }, i = t(e);
    return i || { valid: !0 };
  }
  /**
   * 在指定元素上显示验证提示 tooltip
   */
  static showValidationTooltip(e, t) {
    M.hideValidationTooltip(e);
    let i = e;
    const o = e.tagName.toLowerCase();
    if (o === "input-widget" && e.shadowRoot) {
      const m = e.shadowRoot.querySelector(
        "._Container_1kh2t_1, input"
      );
      m && (i = m);
    } else if (o === "textarea-widget" && e.shadowRoot) {
      const m = e.shadowRoot.querySelector(
        "textarea"
      );
      m && (i = m);
    } else if (o === "checkbox-widget" && e.shadowRoot) {
      const m = e.shadowRoot.querySelector(
        "._Container_r6sov_1"
      );
      m && (i = m);
    } else if (o === "radiogroup-widget" && e.shadowRoot) {
      const m = e.shadowRoot.querySelector(
        "._RadioGroup_pjy8j_1"
      );
      m && (i = m);
    }
    const r = document.createElement("div");
    r.className = "form-validation-tooltip", r.setAttribute("data-validation-tooltip", "true"), r.style.cssText = `
      position: absolute;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background-color: #fff;
      color: #333;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 500;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
      animation: tooltipFadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e5e5e5;
    `;
    const n = document.createElement("div");
    n.className = "tooltip-arrow", n.style.cssText = `
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #fff;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
    `, r.appendChild(n);
    const a = document.createElement("span"), d = E3.replace(/currentColor/g, "#fb6a22");
    a.innerHTML = d, a.style.cssText = "display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 16px; height: 16px;";
    const s = document.createElement("span");
    if (s.textContent = t, r.appendChild(a), r.appendChild(s), !document.querySelector("#form-validation-tooltip-styles")) {
      const m = document.createElement("style");
      m.id = "form-validation-tooltip-styles", m.textContent = `
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `, document.head.appendChild(m);
    }
    document.body.appendChild(r);
    const l = i.getBoundingClientRect(), u = r.getBoundingClientRect();
    let C = l.top - u.height - 8 + window.scrollY, g = l.left + (l.width - u.width) / 2 + window.scrollX, h = !1;
    C < window.scrollY + 10 && (C = l.bottom + 8 + window.scrollY, h = !0), g < 10 ? g = 10 : g + u.width > window.innerWidth - 10 && (g = window.innerWidth - u.width - 10), h && (n.style.cssText = `
        position: absolute;
        top: -6px;
        bottom: auto;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #fff;
        border-top: none;
        filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.1));
      `);
    const v = l.left + l.width / 2 + window.scrollX - g, p = 12, x = u.width - 12, w = Math.max(
      p,
      Math.min(x, v)
    );
    n.style.left = `${w}px`, r.style.top = `${C}px`, r.style.left = `${g}px`, e._validationTooltip = r, setTimeout(() => {
      M.hideValidationTooltip(e);
    }, 3e3);
    const k = () => {
      M.hideValidationTooltip(e), e.removeEventListener("input", k), e.removeEventListener("change", k), e.removeEventListener("click", k);
    };
    e.addEventListener("input", k), e.addEventListener("change", k), e.addEventListener("click", k);
  }
  /**
   * 隐藏指定元素上的验证 tooltip
   */
  static hideValidationTooltip(e) {
    const t = e._validationTooltip;
    t && t.parentNode && (t.parentNode.removeChild(t), e._validationTooltip = null);
  }
  /**
   * 隐藏表单中所有的验证 tooltip
   */
  static hideAllValidationTooltips(e) {
    document.querySelectorAll(
      '[data-validation-tooltip="true"]'
    ).forEach((o) => {
      o.parentNode && o.parentNode.removeChild(o);
    });
    const i = (o) => {
      o._validationTooltip && (o._validationTooltip = null), Array.from(o.children).forEach((r) => i(r));
    };
    i(e);
  }
  render(e) {
    const { direction: t = "col", align: i = "start", justify: o = "start" } = e, r = {
      "data-w-direction": t
    };
    e.gap === void 0 && (r["data-w-auto-spacing"] = ""), i && (r["data-w-align"] = i), o && (r["data-w-justify"] = o), e.wrap && (r["data-w-wrap"] = e.wrap);
    const n = [], a = T3({
      direction: t,
      align: i,
      justify: o,
      wrap: e.wrap,
      gap: e.gap
    });
    return Object.entries(a).forEach(([d, s]) => {
      if (d === "display") return;
      const l = d.replace(/([A-Z])/g, "-$1").toLowerCase();
      n.push(`${l}: ${s}`);
    }), e.padding !== void 0 && n.push(`padding: ${j(e.padding)}`), e.border !== void 0 && n.push(`border: ${$3(e.border)}`), e.background !== void 0 && n.push(`background: ${R3(e.background)}`), e.width !== void 0 && n.push(
      `width: ${typeof e.width == "number" ? `${e.width}px` : e.width}`
    ), e.height !== void 0 && n.push(
      `height: ${typeof e.height == "number" ? `${e.height}px` : e.height}`
    ), e.radius !== void 0 && n.push(`border-radius: ${Z3(e.radius)}`), e.margin !== void 0 && n.push(`margin: ${j(e.margin)}`), /* @__PURE__ */ c(
      "form",
      {
        ref: (d) => {
          this.formRef = d;
        },
        class: "_Box_fbeyu_1",
        ...r,
        style: n.join("; ")
      },
      /* @__PURE__ */ c("slot", null)
    );
  }
};
h3(M, "props", {
  direction: String,
  align: String,
  justify: String,
  wrap: String,
  gap: String,
  padding: String,
  border: [String, Number, Object],
  background: [String, Object],
  flex: [String, Number],
  width: [String, Number],
  height: [String, Number],
  size: [String, Number],
  minWidth: [String, Number],
  minHeight: [String, Number],
  minSize: [String, Number],
  maxWidth: [String, Number],
  maxHeight: [String, Number],
  maxSize: [String, Number],
  aspectRatio: [String, Number],
  radius: String,
  margin: [String, Number, Object],
  onSubmitAction: Function
});
h3(M, "css", S);
h3(M, "collectFormDataFromDOM", E);
h3(M, "getCustomElementValue", P);
M = be([
  y("form-widget")
], M);
class xe {
  // 导出表单数据收集工具，供 Card 和 Countdown 组件使用
  static collectFormDataFromDOM = E;
  static getCustomElementValue = P;
  // 导出 FormWidget 的静态方法，供验证和 UI 提示使用
  static validateRequiredFields = M.validateRequiredFields.bind(M);
  static showValidationTooltip = M.showValidationTooltip.bind(M);
  static hideValidationTooltip = M.hideValidationTooltip.bind(M);
  static hideAllValidationTooltips = M.hideAllValidationTooltips.bind(M);
  render(t, i, o) {
    const r = {
      // 默认值
      direction: "col",
      align: "start",
      justify: "start"
    };
    t.direction !== void 0 && (r.direction = t.direction), t.align !== void 0 && (r.align = t.align), t.justify !== void 0 && (r.justify = t.justify), t.wrap !== void 0 && (r.wrap = t.wrap), t.gap !== void 0 && (r.gap = t.gap), t.padding !== void 0 && (r.padding = t.padding), t.border !== void 0 && (r.border = t.border), t.background !== void 0 && (r.background = t.background), t.flex !== void 0 && (r.flex = t.flex), t.width !== void 0 && (r.width = t.width), t.height !== void 0 && (r.height = t.height), t.size !== void 0 && (r.size = t.size), t.minWidth !== void 0 && (r.minWidth = t.minWidth), t.minHeight !== void 0 && (r.minHeight = t.minHeight), t.minSize !== void 0 && (r.minSize = t.minSize), t.maxWidth !== void 0 && (r.maxWidth = t.maxWidth), t.maxHeight !== void 0 && (r.maxHeight = t.maxHeight), t.maxSize !== void 0 && (r.maxSize = t.maxSize), t.aspectRatio !== void 0 && (r.aspectRatio = t.aspectRatio), t.radius !== void 0 && (r.radius = t.radius), t.margin !== void 0 && (r.margin = t.margin), t.onSubmitAction && o && (r.onSubmitAction = P3(
      t.onSubmitAction,
      o
    ));
    const n = i ? t.children?.map((a) => i(a)) || [] : [];
    return {
      tag: "form-widget",
      props: r,
      children: n
    };
  }
}
class we {
  render(t, i) {
    return {
      tag: "divider-widget",
      props: {
        color: t.color,
        size: t.size,
        spacing: t.spacing,
        flush: t.flush
      },
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class ye {
  render(t, i) {
    return {
      tag: "spacer-widget",
      props: {
        minSize: t.minSize
      },
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class _e {
  render(t, i, o) {
    const r = i ? i(t.children) : null;
    return {
      tag: "transition-widget",
      props: {},
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      },
      children: r ? [r] : []
    };
  }
}
class Le {
  render(t, i) {
    const o = {
      value: t.value,
      size: t.size,
      color: t.color,
      weight: t.weight,
      textAlign: t.textAlign,
      italic: t.italic,
      lineThrough: t.lineThrough,
      truncate: t.truncate,
      maxLines: t.maxLines,
      minLines: t.minLines,
      width: t.width,
      streaming: t.streaming
    };
    t.editable && typeof t.editable == "object" && (o.editable = {
      ...t.editable,
      disabled: t.editable.disabled
    });
    const r = {
      tag: "text-widget",
      props: o
    };
    return (t.id || t.key) && (r.attrs = {}, t.id && (r.attrs.id = t.id), t.key && (r.attrs["data-key"] = t.key)), r;
  }
}
class Se {
  render(t, i, o) {
    const r = {
      value: t.value,
      size: t.size,
      color: t.color,
      weight: t.weight,
      textAlign: t.textAlign,
      truncate: t.truncate,
      maxLines: t.maxLines
    };
    return Object.keys(r).forEach((n) => {
      r[n] === void 0 && delete r[n];
    }), {
      tag: "title-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class Me {
  render(t) {
    return {
      tag: "caption-widget",
      props: {
        value: t.value,
        size: t.size,
        color: t.color,
        weight: t.weight,
        textAlign: t.textAlign,
        truncate: t.truncate,
        maxLines: t.maxLines
      }
    };
  }
}
class He {
  render(t) {
    return {
      tag: "label-widget",
      props: {
        value: t.value,
        fieldName: t.fieldName,
        size: t.size,
        color: t.color,
        weight: t.weight,
        textAlign: t.textAlign
      }
    };
  }
}
class ke {
  render(t) {
    return {
      tag: "badge-widget",
      props: {
        label: t.label,
        color: t.color,
        variant: t.variant,
        size: t.size,
        pill: t.pill
      }
    };
  }
}
class ze {
  render(t) {
    return {
      tag: "image-widget",
      props: {
        src: t.src,
        alt: t.alt,
        frame: t.frame,
        fit: t.fit,
        position: t.position,
        flush: t.flush,
        width: t.width,
        height: t.height,
        size: t.size,
        minWidth: t.minWidth,
        minHeight: t.minHeight,
        minSize: t.minSize,
        maxWidth: t.maxWidth,
        maxHeight: t.maxHeight,
        maxSize: t.maxSize,
        aspectRatio: t.aspectRatio,
        radius: t.radius,
        margin: t.margin
      }
    };
  }
}
class Ae {
  render(t, i) {
    const r = {
      tag: "video-widget",
      props: {
        src: t.src,
        poster: t.poster,
        aspectRatio: t.aspectRatio,
        size: t.size
      }
    };
    return (t.id || t.key) && (r.attrs = {}, t.id && (r.attrs.id = t.id), t.key && (r.attrs["data-key"] = t.key)), r;
  }
}
class Ve {
  render(t, i) {
    const r = {
      tag: "audio-widget",
      props: {
        src: t.src,
        size: t.size
      }
    };
    return (t.id || t.key) && (r.attrs = {}, t.id && (r.attrs.id = t.id), t.key && (r.attrs["data-key"] = t.key)), r;
  }
}
class $e {
  render(t, i, o) {
    const r = {
      duration: t.duration
    };
    t.prefix && (r.prefix = t.prefix), t.suffix && (r.suffix = t.suffix), t.size && (r.size = t.size), t.color && (r.color = t.color), t.onComplete && (r.onCompleteAction = t.onComplete), o && (r.onAction = o);
    const n = {
      tag: "countdown-widget",
      props: r
    };
    return (t.id || t.key) && (n.attrs = {}, t.id && (n.attrs.id = t.id), t.key && (n.attrs["data-key"] = t.key)), n;
  }
}
class Ze {
  render(t, i) {
    const o = {
      name: t.name,
      inputType: t.inputType,
      defaultValue: t.defaultValue,
      required: t.required,
      pattern: t.pattern,
      placeholder: t.placeholder,
      allowAutofillExtensions: t.allowAutofillExtensions,
      autoSelect: t.autoSelect,
      autoFocus: t.autoFocus,
      disabled: t.disabled,
      variant: t.variant,
      size: t.size,
      gutterSize: t.gutterSize,
      pill: t.pill
    }, r = {
      ...t.id ? { id: t.id } : {},
      ...t.key ? { "data-key": t.key } : {}
    };
    return t.required && (r["data-required"] = "true"), t.pattern && (r["data-pattern"] = t.pattern), t.inputType && (r["data-input-type"] = t.inputType), r.name = t.name, {
      tag: "input-widget",
      props: o,
      attrs: r
    };
  }
}
class Re {
  render(t, i) {
    const o = {
      name: t.name,
      defaultValue: t.defaultValue,
      required: t.required,
      disabled: t.disabled,
      maxSize: t.maxSize
    }, r = {
      ...t.id ? { id: t.id } : {},
      ...t.key ? { "data-key": t.key } : {}
    };
    return t.required && (r["data-required"] = "true"), r.name = t.name, {
      tag: "image-select-widget",
      props: o,
      attrs: r
    };
  }
}
class De {
  render(t, i) {
    return {
      tag: "textarea-widget",
      props: {
        name: t.name,
        defaultValue: t.defaultValue,
        required: t.required,
        pattern: t.pattern,
        placeholder: t.placeholder,
        autoSelect: t.autoSelect,
        autoFocus: t.autoFocus,
        disabled: t.disabled,
        variant: t.variant,
        size: t.size,
        gutterSize: t.gutterSize,
        rows: t.rows,
        autoResize: t.autoResize,
        maxRows: t.maxRows,
        allowAutofillExtensions: t.allowAutofillExtensions
      },
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class Te {
  render(t, i, o) {
    const r = {
      name: t.name,
      options: t.options,
      placeholder: t.placeholder,
      defaultValue: t.defaultValue,
      size: t.size,
      disabled: t.disabled,
      clearable: t.clearable,
      pill: t.pill,
      block: t.block,
      variant: t.variant
    };
    return t.onChangeAction && o && (r.onChangeAction = (n) => {
      o({
        ...t.onChangeAction,
        payload: {
          ...t.onChangeAction.payload,
          ...n.detail.payload
          // 合并从组件传递过来的 payload 参数
        }
      });
    }), {
      tag: "select-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class Pe {
  render(t, i, o) {
    const r = {
      name: t.name,
      label: t.label,
      defaultChecked: t.defaultChecked,
      disabled: t.disabled,
      required: t.required
    };
    t.onChangeAction && o && (r.onChangeAction = () => {
      o(t.onChangeAction);
    });
    const n = {
      ...t.id ? { id: t.id } : {},
      ...t.key ? { "data-key": t.key } : {}
    };
    return t.required && (n["data-required"] = "true"), n.name = t.name, {
      tag: "checkbox-widget",
      props: r,
      attrs: n
    };
  }
}
class Be {
  render(t, i, o) {
    const r = {
      name: t.name,
      defaultValue: t.defaultValue,
      placeholder: t.placeholder,
      variant: t.variant,
      size: t.size,
      pill: t.pill,
      block: t.block,
      disabled: t.disabled,
      clearable: t.clearable,
      min: t.min,
      max: t.max,
      side: t.side,
      align: t.align
    };
    t.onChangeAction && o && (r.onChangeAction = () => {
      o(t.onChangeAction);
    });
    const n = {};
    return t.id && (n.id = t.id), t.key && (n["data-key"] = t.key), {
      tag: "datepicker-widget",
      props: r,
      attrs: n
    };
  }
}
class Ee {
  render(t, i, o) {
    const r = {
      name: t.name
    };
    return t.defaultValue !== void 0 && (r.defaultValue = t.defaultValue), t.direction !== void 0 && (r.direction = t.direction), t.disabled !== void 0 && (r.disabled = t.disabled), t.ariaLabel !== void 0 && (r.ariaLabel = t.ariaLabel), t.required !== void 0 && (r.required = t.required), t.options && (r.options = t.options.map((n) => ({
      label: n.label,
      value: n.value,
      disabled: n.disabled
    }))), t.onChangeAction && o && (r.onChangeAction = (n) => {
      o({
        ...t.onChangeAction,
        payload: {
          ...t.onChangeAction.payload,
          value: n
        }
      });
    }), {
      tag: "radiogroup-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
class R {
  // 组件实例缓存（使用 Record 类型以支持动态添加）
  static components = {
    // 容器组件
    Card: new le(),
    ListView: new de(),
    ListViewItem: new ce(),
    Basic: new ue(),
    // 布局组件
    Box: new pe(),
    Row: new he(),
    Col: new Ce(),
    Clickable: new fe(),
    Form: new xe(),
    Divider: new we(),
    Spacer: new ye(),
    Transition: new _e(),
    // 文本组件
    Text: new Le(),
    Title: new Se(),
    Caption: new Me(),
    Label: new He(),
    // ❌ Markdown 移除静态引用，改为动态注册
    // Markdown: new Components.Markdown(),
    // 内容组件
    Badge: new ke(),
    Icon: new v3(),
    Image: new ze(),
    // 媒体组件
    Video: new Ae(),
    Audio: new Ve(),
    Countdown: new $e(),
    // 交互组件
    Button: new N3(),
    // 表单组件
    Input: new Ze(),
    ImageSelect: new Re(),
    Textarea: new De(),
    Select: new Te(),
    Checkbox: new Pe(),
    RadioGroup: new Ee(),
    DatePicker: new Be()
    // 数据可视化组件
    // ❌ Chart 移除静态引用，改为动态注册（在 chart-widget-entry.tsx 中）
    // Chart: new Components.Chart(),
  };
  /**
   * 将 ADPWidget Widget 转换为 TDesign 组件配置
   * @param widget ADPWidget Widget 配置
   * @param onAction 动作回调函数（可选）
   * @returns TDesign 组件配置
   */
  static convert(t, i) {
    const o = t.type, r = this.components[o];
    return r ? r.render(
      t,
      (n) => this.convert(n, i),
      i
    ) : (console.warn(`未知的 ADPWidget 组件类型: ${o}`), { tag: "div", children: [] });
  }
  /**
   * 注册自定义组件
   * @param type 组件类型
   * @param component 组件实例
   */
  static registerComponent(t, i) {
    this.components[t] = i;
  }
  /**
   * 批量注册组件
   * @param components 组件映射对象
   */
  static registerComponents(t) {
    Object.entries(t).forEach(([i, o]) => {
      this.registerComponent(i, o);
    });
  }
}
const Ie = ":host{display:inline-block;position:relative}:host([data-block]){display:block;width:100%}.datepicker-widget .placeholder-text{color:var(--color-tertiary);opacity:.7}[data-radix-popper-content-wrapper]{position:fixed;left:0;top:0;min-width:max-content;will-change:transform;z-index:auto}.datepicker-widget .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.datepicker-widget .relative{position:relative}.datepicker-widget .inline-flex{display:inline-flex}.datepicker-widget .w-full{width:100%;display:flex}.datepicker-widget .bottom-0{bottom:0}.datepicker-widget .pointer-events-none{pointer-events:none}.datepicker-widget .tabular-nums{font-variant-numeric:tabular-nums}";
var Oe = Object.defineProperty, Fe = Object.getOwnPropertyDescriptor, Ne = (e, t, i) => t in e ? Oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, je = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Fe(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, b3 = (e, t, i) => Ne(e, typeof t != "symbol" ? t + "" : t, i);
let H = class extends _ {
  selectedDate = null;
  currentMonth = /* @__PURE__ */ new Date();
  isPopupOpen = !1;
  inputRef = null;
  prevDefaultValue = void 0;
  popupContainer = null;
  triggerRef = null;
  // RAF ID，用于清理
  rafId = null;
  /**
   * 组件安装后初始化
   */
  installed() {
    this.updateHostBlockStyles(), this.initializeDate(), this.prevDefaultValue = this.props.defaultValue, document.addEventListener("click", this.handleDocumentClick);
  }
  /**
   * 组件卸载时清理
   */
  uninstall() {
    this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), document.removeEventListener("click", this.handleDocumentClick), this.destroyPopupContainer(), H.currentOpenInstance === this && (H.currentOpenInstance = null);
  }
  /**
   * 组件更新后
   */
  updated() {
    this.isPopupOpen ? this.renderPopupToBody() : this.destroyPopupContainer();
  }
  /**
   * 属性更新时
   */
  receiveProps() {
    return this.updateHostBlockStyles(), this.props.defaultValue !== this.prevDefaultValue && (this.prevDefaultValue = this.props.defaultValue, this.initializeDate()), !0;
  }
  /**
   * 根据 block 属性设置宿主元素样式
   */
  updateHostBlockStyles() {
    const e = this;
    if (!e) return;
    e.setAttribute("data-w-component", "date-picker"), this.props.block ? e.hasAttribute("data-block") || e.setAttribute("data-block", "") : e.hasAttribute("data-block") && e.removeAttribute("data-block");
  }
  /**
   * 初始化日期
   */
  initializeDate() {
    if (this.props.defaultValue) {
      const e = this.parseDate(this.props.defaultValue);
      e && (this.selectedDate = e, this.currentMonth = new Date(e), this.update());
    } else
      this.selectedDate = null, this.currentMonth = /* @__PURE__ */ new Date(), this.update();
  }
  /**
   * 格式化日期为显示字符串
   */
  formatDate(e) {
    const i = T() === "en-US", o = e.getFullYear(), r = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
    return i ? `${r}/${n}/${String(o).slice(-2)}` : `${o}-${r}-${n}`;
  }
  /**
   * 解析日期字符串
   */
  parseDate(e) {
    if (!e) return null;
    const i = T() === "en-US";
    let o, r, n;
    if (i && e.includes("/")) {
      const d = e.split("/");
      if (d.length === 3)
        r = parseInt(d[0]) - 1, n = parseInt(d[1]), o = parseInt(d[2]), o < 100 && (o += 2e3);
      else
        return null;
    } else if (e.includes("-")) {
      const d = e.split("-");
      if (d.length === 3)
        o = parseInt(d[0]), r = parseInt(d[1]) - 1, n = parseInt(d[2]);
      else
        return null;
    } else
      return null;
    const a = new Date(o, r, n);
    return isNaN(a.getTime()) ? null : a;
  }
  /**
   * 检查日期是否在范围内
   */
  isDateInRange(e) {
    const { min: t, max: i } = this.props;
    if (t) {
      const o = new Date(t);
      if (o.setHours(0, 0, 0, 0), e < o) return !1;
    }
    if (i) {
      const o = new Date(i);
      if (o.setHours(0, 0, 0, 0), e > o) return !1;
    }
    return !0;
  }
  /**
   * 处理日期选择
   */
  handleDateSelect = (e) => {
    this.isDateInRange(e) && (this.selectedDate = e, this.isPopupOpen = !1, H.currentOpenInstance === this && (H.currentOpenInstance = null), this.inputRef && (this.inputRef.value = this.formatDate(e)), this.props.onChangeAction && this.props.onChangeAction(this.formatDate(e)), this.update());
  };
  /**
   * 处理清除按钮点击
   */
  handleClear = (e) => {
    e.stopPropagation(), this.selectedDate = null, this.inputRef && (this.inputRef.value = ""), this.props.onChangeAction && this.props.onChangeAction(""), this.update();
  };
  /**
   * 处理输入框点击
   */
  handleInputClick = (e) => {
    this.props.disabled || (e.stopPropagation(), e.target.closest("._Clear_tkgz5_471")) || (H.currentOpenInstance && H.currentOpenInstance !== this && H.currentOpenInstance.closePopup(), this.isPopupOpen = !this.isPopupOpen, this.isPopupOpen ? H.currentOpenInstance = this : H.currentOpenInstance = null, this.update());
  };
  /**
   * 关闭弹窗（供外部调用）
   */
  closePopup() {
    this.isPopupOpen && (this.isPopupOpen = !1, this.update());
  }
  /**
   * 创建弹窗容器到 body（使用 Shadow DOM 完全隔离）
   */
  createPopupContainer() {
    if (this.popupContainer) return;
    const e = document.createElement("div");
    e.style.cssText = "position: fixed; left: 0; top: 0; z-index: 9999;";
    const t = e.attachShadow({ mode: "open" }), i = document.createElement("style");
    i.textContent = this.getPopupStyles(), t.appendChild(i), this.popupContainer = e, document.body.appendChild(e);
  }
  /**
   * 获取弹窗的自定义样式（完全独立，不依赖外部 CSS）
   * 使用层级嵌套结构：.datepicker-widget-modal 作为命名空间
   */
  getPopupStyles() {
    return `
      /* 重置样式 */
      * {
        box-sizing: border-box;
      }
      
      /* 弹窗模态框命名空间 */
      .datepicker-widget-modal {
        position: relative;
        min-width: max-content;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      
      .datepicker-widget-modal.visible {
        opacity: 1;
        pointer-events: auto;
      }
      
      /* Popover 容器 */
      .datepicker-widget-modal .popover {
        min-width: 230px;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                    0 2px 4px -1px rgba(0, 0, 0, 0.06), 
                    0 0 0 1px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        padding: 10px 12px 12px;
      }
      
      /* 日历容器 */
      .datepicker-widget-modal .calendar {
        height: 200px;
        position: relative;
      }
      
      /* 导航按钮 */
      .datepicker-widget-modal .nav-btn {
        position: absolute;
        top: 0;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: background-color 0.15s;
        z-index: 1;
      }
      
      .datepicker-widget-modal .nav-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .datepicker-widget-modal .nav-btn svg {
        width: 16px;
        height: 16px;
      }
      
      .datepicker-widget-modal .nav-btn.prev {
        left: 0;
      }
      
      .datepicker-widget-modal .nav-btn.next {
        right: 0;
      }
      
      /* 月份标签 */
      .datepicker-widget-modal .month-label {
        margin: 0 0 12px;
        padding: 0;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        text-align: center;
      }
      
      /* 星期和日期网格 */
      .datepicker-widget-modal .week-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
      }
      
      .datepicker-widget-modal .day-label {
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }
      
      .datepicker-widget-modal .day-cell {
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .datepicker-widget-modal .day-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        color: #333;
        position: relative;
        transition: background-color 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .datepicker-widget-modal .day-btn:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .datepicker-widget-modal .day-btn:disabled {
        color: #ccc;
        cursor: not-allowed;
      }
      
      .datepicker-widget-modal .day-cell[data-selected] .day-btn {
        background: #0066ff;
        color: #fff;
      }
      
      .datepicker-widget-modal .day-cell[data-selected] .day-btn:hover {
        background: #0052cc;
      }
      
      /* 今天的标记 */
      .datepicker-widget-modal .today-dot {
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #0066ff;
      }
      
      .datepicker-widget-modal .day-cell[data-selected] .today-dot {
        background: #fff;
      }
    `;
  }
  /**
   * 销毁弹窗容器
   */
  destroyPopupContainer() {
    this.popupContainer && this.popupContainer.parentNode && (this.popupContainer.parentNode.removeChild(this.popupContainer), this.popupContainer = null);
  }
  /**
   * 渲染弹窗到 body（使用 Shadow DOM）
   */
  renderPopupToBody() {
    if (this.createPopupContainer(), !this.popupContainer || !this.triggerRef) return;
    const e = this.popupContainer.shadowRoot;
    e && (this.rafId !== null && (cancelAnimationFrame(this.rafId), this.rafId = null), this.rafId = requestAnimationFrame(() => {
      if (this.rafId = null, !this.popupContainer || !this.triggerRef || !e) return;
      const { side: t = "bottom", align: i = "center" } = this.props, o = this.triggerRef.getBoundingClientRect(), r = document.createElement("div");
      r.className = "datepicker-widget-modal";
      const n = document.createElement("div");
      n.className = "popover", n.innerHTML = this.getCalendarHTML(), r.appendChild(n);
      const a = e.querySelector("style");
      e.innerHTML = "", a && e.appendChild(a), e.appendChild(r), this.bindPopupEvents(n), this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        const d = n.getBoundingClientRect();
        let s = 0, l = 0;
        const u = o.width, C = o.height;
        if (t === "bottom")
          switch (l = o.bottom + 4, i) {
            case "start":
              s = o.left;
              break;
            case "center":
              s = o.left + u / 2 - d.width / 2;
              break;
            case "end":
              s = o.right - d.width;
              break;
          }
        else if (t === "top")
          switch (l = o.top - d.height - 4, i) {
            case "start":
              s = o.left;
              break;
            case "center":
              s = o.left + u / 2 - d.width / 2;
              break;
            case "end":
              s = o.right - d.width;
              break;
          }
        else if (t === "left")
          switch (s = o.left - d.width - 4, i) {
            case "start":
              l = o.top;
              break;
            case "center":
              l = o.top + C / 2 - d.height / 2;
              break;
            case "end":
              l = o.bottom - d.height;
              break;
          }
        else if (t === "right")
          switch (s = o.right + 4, i) {
            case "start":
              l = o.top;
              break;
            case "center":
              l = o.top + C / 2 - d.height / 2;
              break;
            case "end":
              l = o.bottom - d.height;
              break;
          }
        this.popupContainer.style.transform = `translate(${Math.round(
          s
        )}px, ${Math.round(l)}px)`, this.rafId !== null && cancelAnimationFrame(this.rafId), this.rafId = requestAnimationFrame(() => {
          this.rafId = null, r.classList.add("visible");
        });
      });
    }));
  }
  /**
   * 获取日历 HTML（使用层级嵌套的类名）
   */
  getCalendarHTML() {
    const t = T() === "en-US", i = t ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["日", "一", "二", "三", "四", "五", "六"], o = t ? [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ] : null, r = this.currentMonth.getFullYear(), n = this.currentMonth.getMonth(), a = new Date(r, n, 1).getDay(), d = new Date(r, n + 1, 0).getDate(), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    let l = "";
    for (let p = 0; p < a; p++)
      l += '<div class="day-cell"></div>';
    for (let p = 1; p <= d; p++) {
      const x = new Date(r, n, p);
      x.setHours(0, 0, 0, 0);
      const w = x.getTime() === s.getTime(), k = this.selectedDate && x.getTime() === this.selectedDate.getTime(), m = !this.isDateInRange(x);
      l += `
        <div class="day-cell"${k ? " data-selected" : ""}>
          <button class="day-btn" data-day="${p}"${m ? " disabled" : ""}>
            ${p}
            ${w ? '<span class="today-dot"></span>' : ""}
          </button>
        </div>
      `;
    }
    let u = "";
    const C = a + d, g = Math.ceil(C / 7), h = l.match(/<div class="day-cell"[^>]*>[\s\S]*?<\/div>/g) || [];
    for (let p = 0; p < g; p++) {
      const x = h.slice(p * 7, (p + 1) * 7).join("");
      u += `<div class="week-row">${x}</div>`;
    }
    const f = i.map((p) => `<div class="day-label">${p}</div>`).join("");
    return `
      <div class="calendar">
        <button type="button" class="nav-btn prev" data-prev-month>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z" clip-rule="evenodd"></path>
          </svg>
        </button>
        <button type="button" class="nav-btn next" data-next-month>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M8.293 4.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414-1.414L14.586 12 8.293 5.707a1 1 0 0 1 0-1.414Z" clip-rule="evenodd"></path>
          </svg>
        </button>
        <p class="month-label">${t ? `${o[n]} ${r}` : `${r}年 ${String(n + 1).padStart(2, "0")}月`}</p>
        <div class="week-row">${f}</div>
        ${u}
      </div>
    `;
  }
  /**
   * 绑定弹窗事件（使用事件委托避免内存泄漏）
   */
  bindPopupEvents(e) {
    const t = (i) => {
      i.stopPropagation();
      const o = i.target;
      if (o.closest("[data-prev-month]")) {
        this.currentMonth = new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth() - 1,
          1
        ), this.update();
        return;
      }
      if (o.closest("[data-next-month]")) {
        this.currentMonth = new Date(
          this.currentMonth.getFullYear(),
          this.currentMonth.getMonth() + 1,
          1
        ), this.update();
        return;
      }
      const a = o.closest(".day-btn");
      if (a && !a.disabled) {
        const d = parseInt(a.getAttribute("data-day") || "0");
        if (d > 0) {
          const s = this.currentMonth.getFullYear(), l = this.currentMonth.getMonth(), u = new Date(s, l, d);
          u.setHours(0, 0, 0, 0), this.handleDateSelect(u);
        }
      }
    };
    e.addEventListener("click", t);
  }
  /**
   * 处理文档点击（关闭弹窗）
   */
  handleDocumentClick = (e) => {
    if (!this.isPopupOpen) return;
    this.contains(e.target) || (this.isPopupOpen = !1, H.currentOpenInstance === this && (H.currentOpenInstance = null), this.update());
  };
  /**
   * 切换到上个月
   */
  handlePrevMonth = (e) => {
    e.stopPropagation(), this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    ), this.update();
  };
  /**
   * 切换到下个月
   */
  handleNextMonth = (e) => {
    e.stopPropagation(), this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    ), this.update();
  };
  /**
   * 渲染日历（返回 DOM 元素,用于挂载到 body）
   */
  // @ts-ignore - 不再使用
  renderCalendarElement() {
    const e = document.createElement("div");
    e.className = "_CalendarWrapper_5xeql_81";
    const t = document.createElement("div");
    t.className = "_CalendarContainer_5xeql_1", t.style.cssText = "height: 224px; transition: height 0.25s var(--cubic-move);";
    const i = document.createElement("div");
    i.className = "_Previous_5xeql_9";
    const o = this.createNavButton("chevron-left", !0);
    i.appendChild(o), t.appendChild(i);
    const r = document.createElement("div");
    r.className = "_Next_5xeql_42";
    const n = this.createNavButton("chevron-right", !1);
    r.appendChild(n), t.appendChild(r);
    const a = document.createElement("div");
    a.className = "_CalendarRange_5xeql_86", a.style.transform = "translate(0px, 0px)";
    const d = document.createElement("div");
    return d.className = "_Calendar_5xeql_1", d.setAttribute("data-calendar", "true"), d.style.left = "0px", d.innerHTML = this.getCalendarContentHTML(), a.appendChild(d), t.appendChild(a), e.appendChild(t), this.bindCalendarEvents(e, o, n), e;
  }
  /**
   * 创建导航按钮（上一月/下一月）
   */
  // @ts-ignore - 不再使用
  createNavButton(e, t) {
    const i = document.createElement("button");
    i.type = "button", i.className = "_Button_1jdeq_1", i.setAttribute("data-color", "secondary"), i.setAttribute("data-variant", "ghost"), i.setAttribute("data-size", "sm"), i.setAttribute("data-gutter-size", "2xs"), i.setAttribute("data-icon-size", "sm"), i.setAttribute(t ? "data-prev-month" : "data-next-month", "");
    const o = document.createElement("span");
    return o.className = "_ButtonInner_1jdeq_4", o.innerHTML = this.getIconSVG(e), i.appendChild(o), i;
  }
  /**
   * 获取图标 SVG
   */
  // @ts-ignore - 不再使用
  getIconSVG(e) {
    return e === "chevron-left" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M10.5 3.5L6 8l4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' : e === "chevron-right" ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="display: inline-block; vertical-align: middle;"><path d="M5.5 3.5L10 8l-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' : "";
  }
  /**
   * 获取日历内容 HTML（不包含导航按钮）
   */
  // @ts-ignore - 不再使用
  getCalendarContentHTML() {
    const t = T() === "en-US", i = t ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["日", "一", "二", "三", "四", "五", "六"], o = t ? [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ] : null, r = this.currentMonth.getFullYear(), n = this.currentMonth.getMonth(), a = new Date(r, n, 1).getDay(), d = new Date(r, n + 1, 0).getDate(), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    let l = "";
    for (let p = 0; p < a; p++)
      l += '<div class="_Day_5xeql_109"></div>';
    for (let p = 1; p <= d; p++) {
      const x = new Date(r, n, p);
      x.setHours(0, 0, 0, 0);
      const w = x.getTime() === s.getTime(), k = this.selectedDate && x.getTime() === this.selectedDate.getTime(), m = !this.isDateInRange(x);
      l += `
        <div class="_Day_5xeql_109"${k ? " data-is-selected" : ""}>
          <button class="_InteractiveDay_5xeql_146" data-day="${p}"${m ? " disabled" : ""}>
            ${p}
            ${w ? '<span class="_TodayDot_5xeql_193"></span>' : ""}
          </button>
        </div>
      `;
    }
    let u = "";
    const C = a + d, g = Math.ceil(C / 7), h = l.match(/<div class="_Day_5xeql_109"[^>]*>[\s\S]*?<\/div>/g) || [];
    for (let p = 0; p < g; p++) {
      const x = h.slice(p * 7, (p + 1) * 7).join("");
      u += `<div class="_Week_5xeql_100">${x}</div>`;
    }
    const f = i.map((p) => `<div class="_DayLabel_5xeql_109">${p}</div>`).join("");
    return `
      <p class="_MonthLabel_5xeql_121">${t ? `${o[n]} ${r}` : `${r}年 ${String(n + 1).padStart(2, "0")}月`}</p>
      <div class="_Week_5xeql_100">${f}</div>
      ${u}
    `;
  }
  /**
   * 绑定日历事件
   */
  // @ts-ignore - 不再使用
  bindCalendarEvents(e, t, i) {
    t.addEventListener("click", (r) => {
      r.stopPropagation(), this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1
      ), this.update();
    }), i.addEventListener("click", (r) => {
      r.stopPropagation(), this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1
      ), this.update();
    }), e.querySelectorAll("._InteractiveDay_5xeql_146").forEach((r) => {
      r.addEventListener("click", () => {
        const n = parseInt(r.getAttribute("data-day") || "0");
        if (n > 0) {
          const a = this.currentMonth.getFullYear(), d = this.currentMonth.getMonth(), s = new Date(a, d, n);
          s.setHours(0, 0, 0, 0), this.handleDateSelect(s);
        }
      });
    });
  }
  /**
   * 渲染日历（仅用于 Shadow DOM，实际不使用）
   * 保留此方法以避免破坏现有引用
   */
  // @ts-ignore - 保留方法但不使用
  renderCalendar() {
    const t = T() === "en-US", i = t ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] : ["日", "一", "二", "三", "四", "五", "六"], o = t ? [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ] : null, r = this.currentMonth.getFullYear(), n = this.currentMonth.getMonth(), a = new Date(r, n, 1).getDay(), d = new Date(r, n + 1, 0).getDate(), s = /* @__PURE__ */ new Date();
    s.setHours(0, 0, 0, 0);
    const l = [];
    for (let C = 0; C < a; C++)
      l.push(/* @__PURE__ */ c("div", { class: "_Day_5xeql_109" }));
    for (let C = 1; C <= d; C++) {
      const g = new Date(r, n, C);
      g.setHours(0, 0, 0, 0);
      const h = g.getTime() === s.getTime(), f = this.selectedDate && g.getTime() === this.selectedDate.getTime(), v = !this.isDateInRange(g), p = {
        class: "_Day_5xeql_109"
      };
      f && (p["data-is-selected"] = ""), l.push(
        /* @__PURE__ */ c("div", { ...p }, /* @__PURE__ */ c(
          "button",
          {
            class: "_InteractiveDay_5xeql_146",
            disabled: v,
            onClick: () => this.handleDateSelect(g)
          },
          C,
          h && /* @__PURE__ */ c("span", { class: "_TodayDot_5xeql_193" })
        ))
      );
    }
    const u = [];
    for (let C = 0; C < l.length; C += 7)
      u.push(/* @__PURE__ */ c("div", { class: "_Week_5xeql_100" }, l.slice(C, C + 7)));
    return /* @__PURE__ */ c(
      "div",
      {
        class: "_CalendarWrapper_5xeql_81",
        style: "overflow: hidden; padding: 10px 12px 12px;"
      },
      /* @__PURE__ */ c(
        "div",
        {
          class: "_CalendarContainer_5xeql_1",
          style: "height: 224px; transition: height 0.25s var(--cubic-move);"
        },
        /* @__PURE__ */ c("div", { class: "_Previous_5xeql_9" }, /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            class: "_Button_1jdeq_1",
            "data-color": "secondary",
            "data-variant": "ghost",
            "data-size": "sm",
            "data-gutter-size": "2xs",
            "data-icon-size": "sm",
            onClick: this.handlePrevMonth
          },
          /* @__PURE__ */ c("span", { class: "_ButtonInner_1jdeq_4" }, /* @__PURE__ */ c("icon-widget", { name: "chevron-left", size: "sm" }))
        )),
        /* @__PURE__ */ c("div", { class: "_Next_5xeql_42" }, /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            class: "_Button_1jdeq_1",
            "data-color": "secondary",
            "data-variant": "ghost",
            "data-size": "sm",
            "data-gutter-size": "2xs",
            "data-icon-size": "sm",
            onClick: this.handleNextMonth
          },
          /* @__PURE__ */ c("span", { class: "_ButtonInner_1jdeq_4" }, /* @__PURE__ */ c("icon-widget", { name: "chevron-right", size: "sm" }))
        )),
        /* @__PURE__ */ c(
          "div",
          {
            class: "_CalendarRange_5xeql_86",
            style: "transform: translate(0px, 0px);"
          },
          /* @__PURE__ */ c(
            "div",
            {
              class: "_Calendar_5xeql_1",
              "data-calendar": "true",
              style: "left: 0px;"
            },
            /* @__PURE__ */ c("p", { class: "_MonthLabel_5xeql_121" }, t ? `${o[n]} ${r}` : `${r}年 ${String(n + 1).padStart(2, "0")}月`),
            /* @__PURE__ */ c("div", { class: "_Week_5xeql_100" }, i.map((C) => /* @__PURE__ */ c("div", { class: "_DayLabel_5xeql_109" }, C))),
            u
          )
        )
      )
    );
  }
  /**
   * 根据 DatePicker 的 size 计算 dropdown icon 的 size
   */
  getDropdownIconSize(e) {
    return {
      "3xs": "xs",
      "2xs": "xs",
      xs: "xs",
      sm: "xs",
      md: "sm",
      lg: "sm",
      xl: "sm",
      "2xl": "md",
      "3xl": "md"
    }[e] || "sm";
  }
  render(e) {
    const {
      placeholder: t,
      variant: i = "outline",
      size: o = "lg",
      pill: r = !1,
      block: n = !0,
      // 默认为 true
      disabled: a = !1,
      clearable: d = !1
    } = e, s = this.selectedDate !== null, l = this.selectedDate ? this.formatDate(this.selectedDate) : "", u = n ? "relative w-full" : "relative inline-flex", C = this.getDropdownIconSize(o);
    return /* @__PURE__ */ c("div", { class: `${u} datepicker-widget` }, /* @__PURE__ */ c(
      "input",
      {
        tabindex: "-1",
        class: "sr-only w-full bottom-0 pointer-events-none",
        "aria-hidden": "true",
        value: l,
        name: e.name
      }
    ), /* @__PURE__ */ c(
      "span",
      {
        ref: (g) => {
          this.triggerRef = g;
        },
        class: "_SelectControl_tkgz5_1 _DatePicker_rqvzz_1",
        role: "button",
        tabindex: a ? -1 : 0,
        "data-variant": i,
        "data-block": n ? "" : void 0,
        "data-pill": r ? "" : void 0,
        "data-size": o,
        "data-selected": s,
        "data-disabled": a ? "" : void 0,
        "aria-disabled": a,
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": this.isPopupOpen,
        "data-state": this.isPopupOpen ? "open" : "closed",
        onClick: this.handleInputClick
      },
      /* @__PURE__ */ c(
        "icon-widget",
        {
          name: "calendar",
          class: "_StartIcon_tkgz5_525",
          size: C,
          style: s ? void 0 : { color: "var(--input-placeholder-text-color)" }
        }
      ),
      /* @__PURE__ */ c("span", { class: "_TriggerText_tkgz5_507" }, s ? /* @__PURE__ */ c("span", { class: "tabular-nums" }, l) : /* @__PURE__ */ c("span", { class: "placeholder-text" }, t || b("datepicker.placeholder"))),
      /* @__PURE__ */ c("div", { class: "_IndicatorWrapper_tkgz5_517" }, d && s && !a && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          class: "_Button_1jdeq_1 _Clear_tkgz5_471",
          "data-color": "secondary",
          "data-variant": "ghost",
          "data-pill": "",
          "data-uniform": "",
          "data-size": "3xs",
          "aria-label": "Clear current value",
          onClick: this.handleClear
        },
        /* @__PURE__ */ c("span", { class: "_ButtonInner_1jdeq_4" }, /* @__PURE__ */ c("icon-widget", { name: "close", size: "xs" }))
      ), /* @__PURE__ */ c(
        "icon-widget",
        {
          name: "chevron-up-down",
          class: "_DropdownIcon_tkgz5_472",
          size: C
        }
      ))
    ));
  }
};
b3(H, "props", {
  name: String,
  defaultValue: String,
  placeholder: String,
  variant: String,
  size: String,
  pill: Boolean,
  block: Boolean,
  disabled: Boolean,
  clearable: Boolean,
  min: String,
  max: String,
  side: String,
  align: String,
  onChangeAction: Function
});
b3(H, "css", `${S}${Ie}`);
b3(H, "currentOpenInstance", null);
H = je([
  y("datepicker-widget")
], H);
const qe = ':host{display:flex;box-sizing:border-box}:host([data-w-should-stretch]){align-self:stretch}:host([data-w-direction="row"]){flex-direction:row}:host([data-w-scrollable]){overflow:auto}:host([data-w-direction="row"][data-w-scrollable]){scrollbar-width:none}:host([data-w-direction="row"]) box-widget:not([data-w-has-width]){min-width:0}:host([style*="flex:"]){min-width:0;position:relative}:host([data-w-direction="col"]) button-widget,:host([data-w-component="col"]) button-widget{display:block;width:100%}:host box-widget[data-w-component=row]:not([data-w-align]){align-items:center}';
var We = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, Je = (e, t, i) => t in e ? We(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, Ye = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ue(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, t1 = (e, t, i) => Je(e, typeof t != "symbol" ? t + "" : t, i);
let D = class extends _ {
  /**
   * 组件安装后设置宿主元素属性
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 更新宿主元素的 data 属性和样式
   */
  updateHostAttributes() {
    const e = this;
    if (!e) return;
    const t = this.props;
    e.setAttribute(
      "data-w-component",
      t.direction === "row" ? "row" : t.direction === "col" ? "col" : "box"
    );
    const i = t.direction || "col";
    e.setAttribute("data-w-direction", i), t.gap === void 0 ? e.setAttribute("data-w-auto-spacing", "") : e.removeAttribute("data-w-auto-spacing");
    const o = t.direction === "row" || e.getAttribute("data-w-component") === "row";
    t.align ? e.setAttribute("data-w-align", t.align) : o ? e.setAttribute("data-w-align", "center") : e.removeAttribute("data-w-align"), t.justify ? e.setAttribute("data-w-justify", t.justify) : e.removeAttribute("data-w-justify"), t.wrap ? e.setAttribute("data-w-wrap", t.wrap) : e.removeAttribute("data-w-wrap"), t.width !== void 0 || t.size !== void 0 ? e.setAttribute("data-w-has-width", "") : e.removeAttribute("data-w-has-width"), t.height !== void 0 || t.size !== void 0 ? e.setAttribute("data-w-has-height", "") : e.removeAttribute("data-w-has-height"), this.updateStretchBehavior(e), this.applyInlineStyles(e);
  }
  /**
   * 检查父元素的 align 设置，决定当前元素是否应该拉伸撑满
   */
  updateStretchBehavior(e) {
    const t = this.props;
    if (t.width !== void 0 || t.size !== void 0) {
      e.removeAttribute("data-w-should-stretch");
      return;
    }
    const i = e.parentElement;
    if (!i) {
      e.removeAttribute("data-w-should-stretch");
      return;
    }
    i.getAttribute("data-w-align") ? e.removeAttribute("data-w-should-stretch") : e.setAttribute("data-w-should-stretch", "");
  }
  /**
   * 应用内联样式
   */
  applyInlineStyles(e) {
    const t = this.props, i = D3({
      width: t.width,
      height: t.height,
      size: t.size,
      minWidth: t.minWidth,
      minHeight: t.minHeight,
      minSize: t.minSize,
      maxWidth: t.maxWidth,
      maxHeight: t.maxHeight,
      maxSize: t.maxSize,
      aspectRatio: t.aspectRatio,
      radius: t.radius,
      margin: t.margin
    }), o = g1({
      padding: t.padding,
      border: t.border,
      background: t.background,
      flex: t.flex
    }), r = T3({
      direction: t.direction,
      align: t.align,
      justify: t.justify,
      wrap: t.wrap,
      gap: t.gap
    }), n = I(i, o, r), a = Object.entries(n);
    if (a.length > 0) {
      const d = a.map(([s, l]) => `${s.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${l}`).join("; ");
      e.style.cssText = d;
    }
  }
  render() {
    return /* @__PURE__ */ c("slot", null);
  }
};
t1(D, "props", {
  direction: String,
  align: String,
  justify: String,
  wrap: String,
  gap: [String, Number],
  padding: [String, Number, Object],
  border: [Number, Object],
  background: [String, Object],
  flex: [String, Number],
  width: [String, Number],
  height: [String, Number],
  size: [String, Number],
  minWidth: [String, Number],
  minHeight: [String, Number],
  minSize: [String, Number],
  maxWidth: [String, Number],
  maxHeight: [String, Number],
  maxSize: [String, Number],
  aspectRatio: [String, Number],
  radius: String,
  margin: [String, Number, Object],
  children: Array
});
t1(D, "css", `${S}${qe}`);
D = Ye([
  y("box-widget")
], D);
const Ge = ':host{cursor:pointer;transition:opacity .2s ease}:host(:hover){opacity:.85}:host(:active){opacity:.7}:host([data-disabled="true"]){cursor:not-allowed;opacity:.5;pointer-events:auto}:host([data-disabled="true"]:hover){opacity:.5}:host([data-disabled="true"]:active){opacity:.5}';
var Ke = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, Qe = (e, t, i) => t in e ? Ke(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, t6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Xe(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, e1 = (e, t, i) => Qe(e, typeof t != "symbol" ? t + "" : t, i);
let n3 = class extends D {
  /**
   * 组件安装后设置宿主元素属性和事件监听
   */
  installed() {
    super.installed(), this.setupClickHandler(), this.updateDisabledState();
  }
  /**
   * 属性更新时检查 disabled 状态
   */
  receiveProps() {
    const e = super.receiveProps();
    return this.updateDisabledState(), e;
  }
  /**
   * 更新禁用状态
   */
  updateDisabledState() {
    const e = this;
    if (!e) return;
    this.props.disabled ? e.setAttribute("data-disabled", "true") : e.removeAttribute("data-disabled");
  }
  /**
   * 设置点击事件监听器
   */
  setupClickHandler() {
    const e = this;
    e && (e.addEventListener("click", this.handleClick), e.setAttribute("data-w-component", "clickable"));
  }
  /**
   * 处理点击事件
   */
  handleClick = (e) => {
    if (this.props.disabled) {
      e.stopPropagation(), e.preventDefault();
      return;
    }
    const i = this.props.onClickAction;
    i && typeof i == "function" && (e.stopPropagation(), i());
  };
  /**
   * 组件卸载时清理事件监听器
   */
  uninstall() {
    const e = this;
    e && e.removeEventListener("click", this.handleClick);
  }
};
e1(n3, "props", {
  ...D.props,
  onClickAction: Function,
  disabled: Boolean
});
e1(n3, "css", `${D.css}${Ge}`);
n3 = t6([
  y("clickable-widget")
], n3);
const e6 = ":host{display:block}:host button-widget:not(._ActionButton_1436e_46){display:block;width:100%}";
var i6 = Object.defineProperty, r6 = Object.getOwnPropertyDescriptor, o6 = (e, t, i) => t in e ? i6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, n6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? r6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, i1 = (e, t, i) => o6(e, typeof t != "symbol" ? t + "" : t, i);
let a3 = class extends _ {
  /**
   * 组件安装后设置宿主元素属性
   */
  installed() {
    this.updateHostAttributes();
  }
  /**
   * 属性更新时重新设置宿主元素属性
   */
  receiveProps() {
    return this.updateHostAttributes(), !0;
  }
  /**
   * 组件卸载时清理
   */
  uninstalled() {
    this.handleConfirmClick = null;
  }
  /**
   * 更新宿主元素的 data 属性
   */
  updateHostAttributes() {
    const e = this;
    e && e.setAttribute("data-w-container", "card");
  }
  /**
   * 渲染 status 区域
   */
  renderStatus(e) {
    let t = "";
    return typeof e == "string" ? t = e : "text" in e && (t = e.text), /* @__PURE__ */ c(
      "div",
      {
        class: "_StatusBar_custom",
        style: {
          padding: "0.5rem 0",
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)"
        }
      },
      t
    );
  }
  /**
   * 在非 asForm 模式下点击 confirm 按钮时收集表单数据
   */
  handleConfirmClick = () => {
    const { confirm: e } = this.props;
    if (!e) return;
    const t = this, { formData: i, actionWithPayload: o } = v1(
      t,
      e.action
    );
    this.fire("cardsubmit", { formData: i, action: o }), e.onAction && e.onAction(i);
  };
  /**
   * 渲染 Actions 区域
   */
  renderActions() {
    const { confirm: e, cancel: t, disabled: i } = this.props;
    if (!e && !t)
      return null;
    const o = [];
    if (e) {
      const r = i && e.action?.alwaysEnabled !== !0;
      o.push(
        /* @__PURE__ */ c(
          "button-widget",
          {
            label: e.label,
            color: "primary",
            variant: "solid",
            size: "lg",
            pill: !1,
            submit: this.props.asForm,
            disabled: r,
            class: "_ActionButton_1436e_46",
            actionConfig: e.action,
            onClickAction: this.props.asForm ? void 0 : this.handleConfirmClick
          }
        )
      );
    }
    if (t) {
      const r = i && t.action?.alwaysEnabled !== !0;
      o.push(
        /* @__PURE__ */ c(
          "button-widget",
          {
            label: t.label,
            color: "primary",
            variant: "outline",
            size: "lg",
            pill: !1,
            submit: !1,
            disabled: r,
            class: "_ActionButton_1436e_46",
            actionConfig: t.action,
            onClickAction: t.onAction
          }
        )
      );
    }
    return /* @__PURE__ */ c(
      "div",
      {
        class: "_Layout_1iiup_1",
        "data-item-anchor": "start",
        "data-clip": "false",
        "data-dimension": "height",
        style: {
          "--tg-will-change": "auto",
          "--tg-enter-opacity": "1",
          "--tg-enter-transform": "none",
          "--tg-enter-filter": "none",
          "--tg-enter-duration": "600ms",
          "--tg-enter-delay": "100ms",
          "--tg-enter-timing-function": "ease",
          "--tg-exit-opacity": "0",
          "--tg-exit-transform": "none",
          "--tg-exit-filter": "none",
          "--tg-exit-duration": "600ms",
          "--tg-exit-delay": "0ms",
          "--tg-exit-timing-function": "ease",
          "--tg-initial-opacity": "0",
          "--tg-initial-transform": "none",
          "--tg-initial-filter": "none",
          "--tg-layout-enter-duration": "300ms",
          "--tg-layout-enter-delay": "0ms",
          "--tg-layout-enter-timing-function": "var(--cubic-move)",
          "--tg-layout-exit-duration": "300ms",
          "--tg-layout-exit-delay": "0ms",
          "--tg-layout-exit-timing-function": "var(--cubic-move)",
          "--tg-layout-move-duration": "300ms",
          "--tg-layout-move-delay": "0ms",
          "--tg-layout-move-timing-function": "var(--cubic-move)"
        }
      },
      /* @__PURE__ */ c("div", { class: "_TransitionItem_1iiup_40 _ActionRow_1436e_39 _TransitionGroupChild_1d6a5_1" }, o)
    );
  }
  /**
   * 渲染 Card 内容包装器（带边框和样式的外层容器）
   */
  renderCardWrapper(e) {
    const {
      size: t = "sm",
      padding: i = 4,
      background: o,
      theme: r,
      confirm: n,
      cancel: a
    } = this.props;
    let d, s, l, u, C;
    if (typeof i == "number")
      d = `${i * 0.25}rem`, s = l = u = C = d;
    else if (typeof i == "string") {
      d = i;
      const v = i.trim().split(/\s+/);
      v.length === 1 ? s = l = u = C = v[0] : v.length === 2 ? (s = u = v[0], l = C = v[1]) : v.length === 4 ? [s, l, u, C] = v : s = l = u = C = v[0];
    } else {
      const v = i.top !== void 0 ? i.top : i.y !== void 0 ? i.y : 4, p = i.right !== void 0 ? i.right : i.x !== void 0 ? i.x : 4, x = i.bottom !== void 0 ? i.bottom : i.y !== void 0 ? i.y : 4, w = i.left !== void 0 ? i.left : i.x !== void 0 ? i.x : 4;
      s = `${v * 0.25}rem`, l = `${p * 0.25}rem`, u = `${x * 0.25}rem`, C = `${w * 0.25}rem`, d = `${s} ${l} ${u} ${C}`;
    }
    let g = "";
    o && (typeof o == "string" ? g = o : g = o[r || "light"] || "");
    const h = [];
    h.push(`--w-box-gutter-block-start: ${s}`), h.push(`--w-box-gutter-block-end: ${u}`), h.push(`--w-box-gutter-inline-start: ${C}`), h.push(`--w-box-gutter-inline-end: ${l}`), h.push(`padding-block-start: ${s}`), h.push(`padding-block-end: ${u}`), h.push(`padding-inline-start: ${C}`), h.push(`padding-inline-end: ${l}`), g && h.push(`background: ${g}`);
    const f = {
      "data-w-direction": "col",
      "data-w-auto-spacing": "",
      "data-size": t
    };
    return (n || a) && (f["data-has-actions"] = ""), /* @__PURE__ */ c(
      "div",
      {
        class: "_Box_fbeyu_1 _Card_1436e_1",
        ...f,
        style: h.join("; ")
      },
      e
    );
  }
  /**
   * 渲染 Card 内容
   */
  renderCardContent() {
    const { status: e, collapsed: t = !1 } = this.props;
    return /* @__PURE__ */ c(c.f, null, e && this.renderStatus(e), !t && /* @__PURE__ */ c("slot", null));
  }
  /**
   * 🔥 新增：渲染 asForm 模式的 Card 内容（直接使用 form 元素）
   */
  renderAsFormCard() {
    const { confirm: e, status: t, collapsed: i = !1 } = this.props;
    return /* @__PURE__ */ c(
      "form",
      {
        ref: (r) => {
          r && (this._formElement = r);
        },
        "data-w-component": "form",
        "data-w-direction": "col",
        "data-w-auto-spacing": "",
        class: "_Box_fbeyu_1",
        style: "flex-direction: column; align-items: flex-start; justify-content: flex-start;",
        onSubmit: (r) => {
          if (r.preventDefault(), !e) return;
          const n = r.target;
          M.hideAllValidationTooltips(n);
          const a = M.validateRequiredFields(n);
          if (!a.valid && a.firstInvalidElement) {
            M.showValidationTooltip(
              a.firstInvalidElement,
              a.message || b("form.required")
            );
            return;
          }
          const d = E(n), s = new CustomEvent("form-submit-success", {
            bubbles: !0
          });
          n.dispatchEvent(s);
          const l = e.action.payload ? {
            ...e.action,
            payload: {
              ...e.action.payload,
              ...d
            }
          } : e.action;
          this.fire("cardsubmit", { formData: d, action: l }), e.onAction && e.onAction(d);
        }
      },
      t && this.renderStatus(t),
      !i && /* @__PURE__ */ c("slot", null)
    );
  }
  render(e) {
    const { asForm: t } = e, i = this.renderCardContent();
    return t ? /* @__PURE__ */ c("div", null, this.renderCardWrapper(this.renderAsFormCard()), this.renderActions()) : /* @__PURE__ */ c("div", null, this.renderCardWrapper(i), this.renderActions());
  }
};
i1(a3, "props", {
  size: String,
  padding: [String, Number, Object],
  background: [String, Object],
  theme: String,
  status: Object,
  collapsed: Boolean,
  asForm: Boolean,
  confirm: Object,
  cancel: Object,
  disabled: Boolean
  // 🔥 新增
});
i1(a3, "css", `${S}${e6}`);
a3 = n6([
  y("card-widget")
], a3);
var a6 = Object.defineProperty, s6 = Object.getOwnPropertyDescriptor, l6 = (e, t, i) => t in e ? a6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, d6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? s6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, r1 = (e, t, i) => l6(e, typeof t != "symbol" ? t + "" : t, i);
let s3 = class extends _ {
  /**
   * 处理点击事件
   */
  handleClick = (e) => {
    e.preventDefault(), e.stopPropagation(), this.props.onClick && this.props.onClick();
  };
  /**
   * 组件卸载时清理
   */
  uninstalled() {
    this.handleClick = null;
  }
  render(e) {
    const { gap: t, align: i = "center", hasAction: o, innerStyle: r, innerClass: n } = e, a = t || "var(--padding-lg)", d = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      baseline: "baseline",
      stretch: "stretch"
    }, s = {
      scale: "0.985",
      transition: {
        willChange: "auto",
        enter: {
          opacity: "1",
          transform: "none",
          filter: "none",
          duration: "400ms",
          delay: "150ms",
          timingFunction: "ease"
        },
        exit: {
          opacity: "0",
          transform: "none",
          filter: "none",
          duration: "200ms",
          delay: "0ms",
          timingFunction: "ease"
        },
        initial: {
          opacity: "0",
          transform: "none",
          filter: "none"
        },
        layout: {
          enter: {
            duration: "300ms",
            delay: "0ms",
            timingFunction: "var(--cubic-move)"
          },
          exit: {
            duration: "300ms",
            delay: "50ms",
            timingFunction: "var(--cubic-move)"
          },
          move: {
            duration: "300ms",
            delay: "300ms",
            timingFunction: "var(--cubic-move)"
          }
        }
      },
      box: {
        gutter: {
          blockStart: "0.625rem",
          blockEnd: "0.625rem",
          inlineStart: "0.625rem",
          inlineEnd: "0.625rem"
        }
      }
    }, l = `--tg-will-change: ${s.transition.willChange}; --tg-enter-opacity: ${s.transition.enter.opacity}; --tg-enter-transform: ${s.transition.enter.transform}; --tg-enter-filter: ${s.transition.enter.filter}; --tg-enter-duration: ${s.transition.enter.duration}; --tg-enter-delay: ${s.transition.enter.delay}; --tg-enter-timing-function: ${s.transition.enter.timingFunction}; --tg-exit-opacity: ${s.transition.exit.opacity}; --tg-exit-transform: ${s.transition.exit.transform}; --tg-exit-filter: ${s.transition.exit.filter}; --tg-exit-duration: ${s.transition.exit.duration}; --tg-exit-delay: ${s.transition.exit.delay}; --tg-exit-timing-function: ${s.transition.exit.timingFunction}; --tg-initial-opacity: ${s.transition.initial.opacity}; --tg-initial-transform: ${s.transition.initial.transform}; --tg-initial-filter: ${s.transition.initial.filter}; --tg-layout-enter-duration: ${s.transition.layout.enter.duration}; --tg-layout-enter-delay: ${s.transition.layout.enter.delay}; --tg-layout-enter-timing-function: ${s.transition.layout.enter.timingFunction}; --tg-layout-exit-duration: ${s.transition.layout.exit.duration}; --tg-layout-exit-delay: ${s.transition.layout.exit.delay}; --tg-layout-exit-timing-function: ${s.transition.layout.exit.timingFunction}; --tg-layout-move-duration: ${s.transition.layout.move.duration}; --tg-layout-move-delay: ${s.transition.layout.move.delay}; --tg-layout-move-timing-function: ${s.transition.layout.move.timingFunction}`, u = `gap: ${a}; align-items: ${d[i] || "center"}; --scale: ${s.scale}${r ? `; ${r}` : ""}`, C = `--w-box-gutter-block-start: ${s.box.gutter.blockStart}; --w-box-gutter-block-end: ${s.box.gutter.blockEnd}; --w-box-gutter-inline-start: ${s.box.gutter.inlineStart}; --w-box-gutter-inline-end: ${s.box.gutter.inlineEnd}; padding-block: 0.625rem; padding-inline: 0.625rem; gap: 0.75rem;`, g = `_ListViewItem_1nrdh_1 ${o ? "listviewitem-widget--clickable" : ""} ${n || ""}`.trim();
    return /* @__PURE__ */ c(
      "span",
      {
        class: "_LayoutItem_au94d_1 _TransitionGroupChild_1d6a5_1",
        style: l
      },
      /* @__PURE__ */ c(
        "div",
        {
          class: g,
          "data-interactive": "",
          style: u,
          onClick: o ? this.handleClick : void 0
        },
        /* @__PURE__ */ c(
          "div",
          {
            class: "_Box_fbeyu_1 relative",
            "data-w-direction": "row",
            "data-w-align": "center",
            "data-w-component": "row",
            style: C
          },
          /* @__PURE__ */ c("slot", null)
        )
      )
    );
  }
};
r1(s3, "props", {
  gap: String,
  align: String,
  hasAction: Boolean,
  innerStyle: String,
  innerClass: String,
  onClick: Function
});
r1(s3, "css", `${S}`);
s3 = d6([
  y("listviewitem-widget")
], s3);
const c6 = ":host{display:inline-flex;align-items:center;vertical-align:middle;min-width:0;width:100%}";
var u6 = Object.defineProperty, p6 = Object.getOwnPropertyDescriptor, h6 = (e, t, i) => t in e ? u6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, C6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? p6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, o1 = (e, t, i) => h6(e, typeof t != "symbol" ? t + "" : t, i);
let l3 = class extends _ {
  inputRef = null;
  isFocused = !1;
  prevAutoFocus = !1;
  prevAutoSelect = !1;
  prevInputType = void 0;
  /**
   * 组件安装后处理 autoFocus 和 autoSelect
   */
  installed() {
    this.prevInputType = this.props.inputType, this.updateHostAttributes(), this.handleAutoFocusIfNeeded();
  }
  /**
   * 组件更新后也检查是否需要自动聚焦（确保 ref 已设置）
   */
  updated() {
    this.updateHostAttributes(), this.handleInputTypeChange(), this.handleAutoFocusIfNeeded();
  }
  /**
   * 更新宿主元素的属性（用于表单验证）
   */
  updateHostAttributes() {
    const e = this;
    e && (e.setAttribute("data-w-component", "input"), this.props.required ? e.setAttribute("data-required", "true") : e.removeAttribute("data-required"), this.props.pattern ? e.setAttribute("data-pattern", this.props.pattern) : e.removeAttribute("data-pattern"), this.props.inputType ? e.setAttribute("data-input-type", this.props.inputType) : e.removeAttribute("data-input-type"));
  }
  /**
   * 组件卸载时清理表单验证状态
   */
  uninstalled() {
    this.inputRef && (this.inputRef.setCustomValidity(""), this.inputRef.form && (this.inputRef.form.noValidate = !0));
  }
  /**
   * 处理输入类型变化
   * 当从 text 类型切换到 number 类型时，过滤掉无效字符
   */
  handleInputTypeChange() {
    const e = this.props.inputType;
    if (this.prevInputType !== "number" && e === "number" && this.inputRef && this.inputRef.value) {
      const t = this.filterNumberValue(this.inputRef.value);
      t !== this.inputRef.value && (this.inputRef.value = t, this.fire("change", { value: t }), this.props.onChange && this.props.onChange(t));
    }
    this.prevInputType = e;
  }
  /**
   * 处理自动聚焦和自动选择
   * 根据当前和之前的状态决定执行的动作
   */
  handleAutoFocusIfNeeded() {
    if (!this.inputRef) return;
    const { autoFocus: e = !1, autoSelect: t = !1 } = this.props, i = t !== this.prevAutoSelect, o = e !== this.prevAutoFocus;
    !i && !o || (this.prevAutoFocus = e, this.prevAutoSelect = t, t ? requestAnimationFrame(() => {
      this.inputRef && (this.inputRef.focus(), this.inputRef.value && this.inputRef.select());
    }) : e && requestAnimationFrame(() => {
      if (this.inputRef && (this.inputRef.focus(), this.inputRef.setSelectionRange && this.inputRef.value)) {
        const r = this.inputRef.value.length;
        this.inputRef.setSelectionRange(r, r);
      }
    }));
  }
  /**
   * 处理输入框聚焦
   */
  handleFocus = () => {
    this.isFocused = !0, this.update();
  };
  /**
   * 处理输入框失焦
   */
  handleBlur = () => {
    this.isFocused = !1, this.update();
  };
  /**
   * 公开 value 属性，供外部（如 Form）读取当前值
   */
  get value() {
    return this.inputRef?.value || "";
  }
  /**
   * 公开 name 属性，供外部（如 Form）读取
   */
  get name() {
    return this.props.name || "";
  }
  /**
   * 处理输入变化
   */
  handleInput = (e) => {
    const t = e.target;
    let i = t.value;
    if (this.props.inputType === "number") {
      const o = this.filterNumberValue(i);
      o !== i && (t.value = o, i = o);
    }
    this.fire("input", { value: i }), this.fire("change", { value: i }), this.props.onChange && this.props.onChange(i);
  };
  /**
   * 过滤 number 类型的值，只保留有效的数字字符
   */
  filterNumberValue(e) {
    if (e === "") return "";
    let t = e.replace(/[^\d.-]/g, "");
    const i = t.startsWith("-");
    t = t.replace(/-/g, ""), i && (t = "-" + t);
    const o = t.split(".");
    return o.length > 2 && (t = o[0] + "." + o.slice(1).join("")), t;
  }
  /**
   * 处理键盘按下事件（number 类型）
   */
  handleKeyDown = (e) => {
    const { inputType: t } = this.props;
    if (t !== "number") return;
    const i = e.key, o = e.target, r = o.value, n = o.selectionStart || 0, a = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ];
    (e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(i.toLowerCase()) || a.includes(i) || /^\d$/.test(i) || i === "." && !r.includes(".") || i === "-" && n === 0 && !r.startsWith("-") || e.preventDefault();
  };
  /**
   * 处理 number 类型的输入过滤
   */
  handleBeforeInput = (e) => {
    const { inputType: t } = this.props;
    if (t !== "number") return;
    const i = e.target, o = e.data || "", r = i.value, n = i.selectionStart || 0, a = i.selectionEnd || 0, d = r.substring(0, n), s = r.substring(a), l = d + o + s;
    this.isValidNumberInput(l) || e.preventDefault();
  };
  /**
   * 验证是否为有效的数字输入
   */
  isValidNumberInput(e) {
    return e === "" || e === "-" ? !0 : /^-?\d+\.?\d*$/.test(e);
  }
  /**
   * 处理粘贴事件（number 类型）
   */
  handlePaste = (e) => {
    const { inputType: t } = this.props;
    if (t !== "number") return;
    const i = e.target, o = e.clipboardData?.getData("text") || "", r = i.value, n = i.selectionStart || 0, a = i.selectionEnd || 0, d = r.substring(0, n), s = r.substring(a), l = d + o + s;
    this.isValidNumberInput(l) || e.preventDefault();
  };
  render(e) {
    const {
      name: t,
      inputType: i = "text",
      defaultValue: o,
      required: r = !1,
      pattern: n,
      placeholder: a,
      allowAutofillExtensions: d = !1,
      // autoSelect 和 autoFocus 在 handleAutoFocusIfNeeded() 中从 this.props 读取，不需要在这里解构
      disabled: s = !1,
      variant: l = "outline",
      size: u = "md",
      gutterSize: C,
      pill: g = !1
    } = e, h = {
      "data-variant": l,
      "data-size": u,
      "data-focused": this.isFocused ? "true" : "false"
    };
    C && (h["data-gutter-size"] = C), g && (h["data-pill"] = !0), s && (h["data-disabled"] = !0);
    const f = {
      name: t,
      type: i === "number" ? "text" : i,
      // number 类型使用 text + JS 过滤
      placeholder: a,
      disabled: s
    };
    return o !== void 0 && (f.defaultValue = o), r && (f.required = !0), n && (f.pattern = n), d ? i === "password" ? f.autocomplete = "current-password" : i === "email" ? f.autocomplete = "email" : i === "tel" ? f.autocomplete = "tel" : i === "url" && (f.autocomplete = "url") : f.autocomplete = "off", /* @__PURE__ */ c("div", { class: "_Container_1kh2t_1", ...h }, /* @__PURE__ */ c(
      "input",
      {
        ref: (v) => {
          this.inputRef = v;
        },
        class: "_Input_1kh2t_235",
        "data-lpignore": d ? void 0 : "true",
        "data-1p-ignore": d ? void 0 : "true",
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onInput: this.handleInput,
        onKeydown: this.handleKeyDown,
        onBeforeinput: this.handleBeforeInput,
        onPaste: this.handlePaste,
        ...f
      }
    ));
  }
};
o1(l3, "props", {
  name: String,
  inputType: String,
  defaultValue: String,
  required: Boolean,
  pattern: String,
  placeholder: String,
  allowAutofillExtensions: Boolean,
  autoSelect: Boolean,
  autoFocus: Boolean,
  disabled: Boolean,
  variant: String,
  size: String,
  gutterSize: String,
  pill: Boolean,
  onChange: Function
});
o1(l3, "css", `${S}${c6}`);
l3 = C6([
  y("input-widget")
], l3);
const f6 = ":host{display:block;width:88px;min-height:88px}._Container_img_1{position:relative;width:100%;height:88px;background:var(--color-surface);border-radius:3px;border:1px dashed var(--color-border);cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:center;overflow:hidden}._Container_img_1:hover:not([data-disabled=true]):not([data-has-image=true]){background:var(--color-background-primary-surface);border-color:var(--color-border)}._Container_img_1[data-disabled=true]{cursor:not-allowed;background:var(--color-background-primary-surface);border-color:var(--color-border-disabled)}._Placeholder_img_1{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px;width:100%;height:100%}._PlaceholderText_img_1{font-size:var(--font-text-xs-size);font-family:PingFang SC,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-weight:400;line-height:1.2}._Container_img_1:not([data-disabled=true]):not(:hover) ._PlaceholderText_img_1{color:var(--color-text-tertiary)}._Container_img_1:hover:not([data-disabled=true]) ._PlaceholderText_img_1{color:var(--color-text-secondary)}._Container_img_1[data-disabled=true] ._PlaceholderText_img_1{color:var(--color-text-tertiary)}._PreviewImage_img_1{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:3px}._ImageError_img_1{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;color:var(--color-text-danger);background-color:var(--color-surface)}._ErrorIcon_img_1{font-size:24px;margin-bottom:var(--spacing)}._ErrorText_img_1{font-size:var(--font-text-xs-size);text-align:center}._PreviewOverlay_img_1{position:absolute;inset:0;background-color:transparent;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease,background-color .2s ease;border-radius:3px}._Container_img_1[data-has-image=true]:hover ._PreviewOverlay_img_1{opacity:1;background-color:#00000052}._Container_img_1[data-has-image=true]:hover:not([data-disabled=true]){border:1px dashed var(--color-border)}._Container_img_1[data-has-image=true][data-disabled=true]{opacity:.38;border:1px dashed var(--color-border-subtle);background:var(--color-surface)}._Container_img_1[data-has-image=true][data-disabled=true] ._PreviewImage_img_1{opacity:1}._Container_img_1[data-disabled=true] ._PreviewOverlay_img_1{display:none}._ClearButton_img_1{background-color:transparent;color:var(--color-text-inverse);border:none;border-radius:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s ease}._ClearButton_img_1:hover:not(:disabled){background-color:transparent;transform:scale(1.1)}._ClearButton_img_1:disabled{cursor:not-allowed;opacity:.6}._Container_img_1[data-has-image=true]{border:none;cursor:default}._ErrorMessage_img_1{margin-top:4px;color:#e34d59;font-size:12px;line-height:1.5;font-family:PingFang SC,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}";
var g6 = Object.defineProperty, m6 = Object.getOwnPropertyDescriptor, v6 = (e, t, i) => t in e ? g6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, b6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? m6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, n1 = (e, t, i) => v6(e, typeof t != "symbol" ? t + "" : t, i);
const x6 = 20 * 1024 * 1024;
let d3 = class extends _ {
  fileInputRef = null;
  currentValue = "";
  previewUrl = "";
  prevDefaultValue = void 0;
  imageLoadError = !1;
  errorMessage = "";
  // 错误提示信息
  /**
   * 组件安装后处理初始化
   */
  installed() {
    this.updateHostAttributes(), this.initializeValue(), this.prevDefaultValue = this.props.defaultValue;
  }
  /**
   * 组件更新后也检查属性更新
   */
  updated() {
    this.updateHostAttributes(), this.props.defaultValue !== this.prevDefaultValue && (this.prevDefaultValue = this.props.defaultValue, this.initializeValueWithoutUpdate());
  }
  /**
   * 初始化值（会触发更新）
   */
  initializeValue() {
    this.initializeValueWithoutUpdate(), this.update();
  }
  /**
   * 初始化值（不触发更新，用于 updated 钩子中避免循环）
   */
  initializeValueWithoutUpdate() {
    const e = this.props.defaultValue;
    this.errorMessage = "", e && e.trim() ? this.isValidImageData(e) ? (this.currentValue = e, this.previewUrl = e, this.imageLoadError = !1) : (this.errorMessage = b("imageselect.invalidDefaultValue"), this.currentValue = "", this.previewUrl = "", this.imageLoadError = !1) : (this.currentValue = "", this.previewUrl = "", this.imageLoadError = !1);
  }
  /**
   * 验证是否为有效的图片数据（base64或URL）
   */
  isValidImageData(e) {
    if (!e || typeof e != "string")
      return !1;
    const t = e.trim();
    if (t.startsWith("data:image/"))
      return t.includes(";base64,");
    try {
      const i = new URL(t);
      if (i.protocol === "http:" || i.protocol === "https:") {
        const o = i.pathname.toLowerCase(), n = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".bmp",
          ".svg"
        ].some(
          (d) => o.endsWith(d)
        ), a = !o.includes(".") || o.endsWith("/");
        return n || a;
      }
    } catch {
    }
    return !1;
  }
  /**
   * 处理图片加载错误
   */
  handleImageError = () => {
    this.imageLoadError || (this.errorMessage = b("imageselect.imageLoadFailed"), this.imageLoadError = !0, this.update());
  };
  /**
   * 处理图片加载成功
   */
  handleImageLoad = () => {
    this.imageLoadError && (this.imageLoadError = !1, this.errorMessage = "", this.update());
  };
  /**
   * 更新宿主元素的属性（用于表单验证和样式）
   */
  updateHostAttributes() {
    const e = this;
    e && (e.setAttribute("data-w-component", "image-select"), this.props.required ? e.setAttribute("data-required", "true") : e.removeAttribute("data-required"));
  }
  /**
   * 公开 value 属性，供外部（如 Form）读取当前值
   */
  get value() {
    return this.currentValue || "";
  }
  /**
   * 公开 name 属性，供外部（如 Form）读取
   */
  get name() {
    return this.props.name || "";
  }
  /**
   * 处理文件选择
   */
  handleFileSelect = (e) => {
    const t = e.target, i = t.files?.[0];
    if (i) {
      if (!this.isValidImageType(i)) {
        this.errorMessage = b("imageselect.invalidFileType"), t.value = "", this.update();
        return;
      }
      if (i.size > x6) {
        this.errorMessage = b("imageselect.fileSizeExceedsHardLimit"), t.value = "", this.update();
        return;
      }
      if (this.props.maxSize && i.size > this.props.maxSize) {
        const o = (this.props.maxSize / 1048576).toFixed(1);
        this.errorMessage = b("imageselect.fileSizeExceedsLimit", {
          maxSize: o
        }), t.value = "", this.update();
        return;
      }
      this.convertToBase64(i);
    }
  };
  /**
   * 检查是否为有效的图片类型
   */
  isValidImageType(e) {
    return e.type.startsWith("image/");
  }
  /**
   * 将文件转换为base64
   */
  convertToBase64(e) {
    this.imageLoadError = !1, this.errorMessage = "";
    const t = new FileReader();
    t.onload = (i) => {
      const o = i.target?.result, r = `ADPWidgetImageSelect=${o}`;
      this.currentValue = r, this.previewUrl = o, this.fire("change", { value: r }), this.props.onChange && this.props.onChange(r), this.update();
    }, t.onerror = () => {
      this.errorMessage = b("imageselect.fileReadFailed"), this.update();
    }, t.readAsDataURL(e);
  }
  /**
   * 处理点击选择区域
   */
  handleSelectClick = () => {
    this.props.disabled || this.fileInputRef?.click();
  };
  /**
   * 处理清除图片
   */
  handleClear = (e) => {
    e.stopPropagation(), !this.props.disabled && (this.currentValue = "", this.previewUrl = "", this.imageLoadError = !1, this.errorMessage = "", this.fileInputRef && (this.fileInputRef.value = ""), this.fire("change", { value: "" }), this.props.onChange && this.props.onChange(""), this.update());
  };
  render(e) {
    const { disabled: t = !1 } = e, i = {
      "data-has-image": this.previewUrl ? "true" : "false"
    };
    t && (i["data-disabled"] = !0);
    const o = t || this.previewUrl ? {} : {
      onClick: this.handleSelectClick
    };
    return /* @__PURE__ */ c(c.f, null, /* @__PURE__ */ c("div", { class: "_Container_img_1", ...i, ...o }, /* @__PURE__ */ c(
      "input",
      {
        ref: (r) => {
          this.fileInputRef = r;
        },
        type: "file",
        accept: "image/*",
        disabled: t,
        style: { display: "none" },
        onChange: this.handleFileSelect
      }
    ), this.previewUrl ? /* @__PURE__ */ c(c.f, null, this.imageLoadError ? /* @__PURE__ */ c("div", { class: "_ImageError_img_1" }, /* @__PURE__ */ c("div", { class: "_ErrorIcon_img_1" }, "❌"), /* @__PURE__ */ c("div", { class: "_ErrorText_img_1" }, b("imageselect.imageLoadFailed"))) : /* @__PURE__ */ c(
      "img",
      {
        src: this.previewUrl,
        alt: b("imageselect.previewAlt"),
        class: "_PreviewImage_img_1",
        onError: this.handleImageError,
        onLoad: this.handleImageLoad
      }
    ), /* @__PURE__ */ c("div", { class: "_PreviewOverlay_img_1" }, /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        class: "_ClearButton_img_1",
        onClick: this.handleClear,
        disabled: t
      },
      /* @__PURE__ */ c("icon-widget", { name: "delete-white" })
    ))) : /* @__PURE__ */ c("div", { class: "_Placeholder_img_1" }, /* @__PURE__ */ c("div", { class: "_PlaceholderIcon_img_1" }, /* @__PURE__ */ c("icon-widget", { name: "upload-normal", size: "md" })), /* @__PURE__ */ c("div", { class: "_PlaceholderText_img_1" }, b("imageselect.uploadText")))), this.errorMessage && /* @__PURE__ */ c("div", { class: "_ErrorMessage_img_1" }, this.errorMessage));
  }
};
n1(d3, "props", {
  name: String,
  defaultValue: String,
  required: Boolean,
  disabled: Boolean,
  maxSize: Number,
  onChange: Function
});
n1(d3, "css", `${S}${f6}`);
d3 = b6([
  y("image-select-widget")
], d3);
const w6 = ":host{display:inline-flex;align-items:center;vertical-align:middle}:host .hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}";
var y6 = Object.defineProperty, _6 = Object.getOwnPropertyDescriptor, L6 = (e, t, i) => t in e ? y6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, S6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? _6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, a1 = (e, t, i) => L6(e, typeof t != "symbol" ? t + "" : t, i);
let c3 = class extends _ {
  // 使用 createRef 创建引用
  inputRef = k3();
  checkboxId = `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  // 内部状态：是否被选中
  checked = !1;
  /**
   * 组件安装后初始化状态
   */
  installed() {
    const e = this.props.defaultChecked;
    typeof e == "boolean" ? this.checked = e : e === "true" ? this.checked = !0 : e === "false" ? this.checked = !1 : this.checked = !1, this.updateHostAttributes();
  }
  /**
   * 组件更新后更新宿主元素属性
   */
  updated() {
    this.updateHostAttributes();
  }
  /**
   * 更新宿主元素的属性（用于表单验证）
   */
  updateHostAttributes() {
    const e = this;
    e && (e.setAttribute("data-w-component", "checkbox"), this.props.required ? e.setAttribute("data-required", "true") : e.removeAttribute("data-required"));
  }
  /**
   * 处理 checkbox 点击
   */
  handleClick = (e) => {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (e.stopPropagation(), this.checked = !this.checked, this.inputRef.current) {
      this.inputRef.current.checked = this.checked;
      const t = new Event("change", { bubbles: !0 });
      this.inputRef.current.dispatchEvent(t);
    }
    this.props.onChangeAction && (this.fire("changeAction"), this.props.onChangeAction()), this.update();
  };
  /**
   * 处理键盘事件（空格键和回车键）
   */
  handleKeyDown = (e) => {
    this.props.disabled || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.handleClick(e));
  };
  /**
   * 组件卸载时清理
   */
  uninstalled() {
    this.inputRef.current && (this.inputRef.current = null);
  }
  render(e) {
    const { name: t, label: i, disabled: o = !1 } = e, r = this.checked, n = !!i, a = {
      "data-orientation": "left"
    };
    n && (a["data-has-label"] = !0), o && (a["data-disabled"] = !0);
    const d = {
      "data-state": r ? "checked" : "unchecked"
    };
    return o && (d["data-disabled"] = !0), /* @__PURE__ */ c("div", { class: "relative inline-flex" }, /* @__PURE__ */ c(
      "input",
      {
        ref: this.inputRef,
        tabindex: "-1",
        class: "hidden",
        "aria-hidden": "true",
        type: "checkbox",
        name: t,
        checked: r,
        disabled: o
      }
    ), /* @__PURE__ */ c("div", { class: "_Container_r6sov_1", ...a }, /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        role: "checkbox",
        "aria-checked": r,
        "aria-label": i || t,
        class: "_Checkbox_r6sov_24",
        id: this.checkboxId,
        onClick: this.handleClick,
        onKeyDown: this.handleKeyDown,
        disabled: o,
        ...d
      },
      r && /* @__PURE__ */ c("span", { class: "_CheckMark_r6sov_80" })
    ), n && /* @__PURE__ */ c("label", { class: "_Label_r6sov_153", onClick: this.handleClick }, i)));
  }
};
a1(c3, "props", {
  name: String,
  label: String,
  defaultChecked: Boolean,
  disabled: Boolean,
  required: Boolean,
  onChangeAction: Function
});
a1(c3, "css", `${S}${w6}`);
c3 = S6([
  y("checkbox-widget")
], c3);
const M6 = ":host{display:block;width:100%}:host([data-auto-resize]) ._Textarea_zroze_177{resize:none;overflow:hidden;min-height:auto;max-height:none}";
var H6 = Object.defineProperty, k6 = Object.getOwnPropertyDescriptor, z6 = (e, t, i) => t in e ? H6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, A6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? k6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, s1 = (e, t, i) => z6(e, typeof t != "symbol" ? t + "" : t, i);
let u3 = class extends _ {
  textareaRef = null;
  isFocused = !1;
  prevAutoFocus = !1;
  prevAutoSelect = !1;
  prevDefaultValue = void 0;
  /**
   * 组件安装后处理 autoFocus 和 autoSelect
   */
  installed() {
    this.updateHostAttributes(), this.updateDefaultValue(), this.handleAutoFocusIfNeeded(), this.props.autoResize && this.textareaRef && this.updateTextareaHeight();
  }
  /**
   * 属性更新时重新调整高度
   */
  updated() {
    this.updateHostAttributes(), this.updateDefaultValue(), this.handleAutoFocusIfNeeded(), this.props.autoResize && this.textareaRef && this.updateTextareaHeight();
  }
  /**
   * 更新 textarea 的默认值
   */
  updateDefaultValue() {
    if (!this.textareaRef) return;
    const { defaultValue: e } = this.props;
    e !== this.prevDefaultValue && (this.textareaRef.value = e || "", this.prevDefaultValue = e, this.props.autoResize && this.updateTextareaHeight());
  }
  /**
   * 更新 host 元素的属性（用于 CSS 选择器和表单验证）
   */
  updateHostAttributes() {
    const e = this.shadowRoot?.host;
    e && (e.setAttribute("data-w-component", "textarea"), this.props.autoResize ? e.setAttribute("data-auto-resize", "") : e.removeAttribute("data-auto-resize"), this.props.required ? e.setAttribute("data-required", "true") : e.removeAttribute("data-required"), this.props.pattern ? e.setAttribute("data-pattern", this.props.pattern) : e.removeAttribute("data-pattern"));
  }
  /**
   * 处理自动聚焦和自动选择
   * 根据当前和之前的状态决定执行的动作
   */
  handleAutoFocusIfNeeded() {
    if (!this.textareaRef) return;
    const { autoFocus: e = !1, autoSelect: t = !1 } = this.props, i = t !== this.prevAutoSelect, o = e !== this.prevAutoFocus;
    !i && !o || (this.prevAutoFocus = e, this.prevAutoSelect = t, t ? requestAnimationFrame(() => {
      this.textareaRef && (this.textareaRef.focus(), this.textareaRef.value && this.textareaRef.select());
    }) : e && requestAnimationFrame(() => {
      if (this.textareaRef && (this.textareaRef.focus(), this.textareaRef.setSelectionRange && this.textareaRef.value)) {
        const r = this.textareaRef.value.length;
        this.textareaRef.setSelectionRange(r, r);
      }
    }));
  }
  /**
   * 处理输入事件
   */
  handleInput = (e) => {
    const { autoResize: t } = this.props;
    t && this.textareaRef && this.updateTextareaHeight(), this.fire("change", {
      value: e.target.value
    });
  };
  /**
   * 处理焦点事件
   */
  handleFocus = () => {
    this.isFocused = !0, this.update();
  };
  /**
   * 处理失焦事件
   */
  handleBlur = () => {
    this.isFocused = !1, this.update();
  };
  /**
   * 公开 value 属性，供外部（如 Form）读取当前值
   */
  get value() {
    return this.textareaRef?.value || "";
  }
  /**
   * 公开 name 属性，供外部（如 Form）读取
   */
  get name() {
    return this.props.name || "";
  }
  /**
   * 动态更新 textarea 高度（autoResize 模式）
   * 根据内容自动调整高度，同时遵守 min-height 和 max-height 限制
   */
  updateTextareaHeight() {
    if (!this.textareaRef) return;
    const { rows: e = 3, maxRows: t } = this.props, i = window.getComputedStyle(this.textareaRef), o = parseFloat(i.lineHeight), r = parseFloat(i.paddingTop) + parseFloat(i.paddingBottom), n = e || 3, a = t && t > 0 ? t : 999, d = r + o * n, s = r + o * a;
    this.textareaRef.style.height = "auto";
    const l = this.textareaRef.scrollHeight;
    let u = Math.max(d, l);
    u = Math.min(u, s), this.textareaRef.style.height = `${u}px`;
  }
  render(e) {
    const {
      name: t,
      required: i = !1,
      pattern: o,
      placeholder: r = "",
      disabled: n = !1,
      variant: a = "outline",
      size: d = "md",
      gutterSize: s,
      rows: l = 3,
      autoResize: u = !1
    } = e, C = {
      "data-variant": a,
      "data-size": d,
      "data-focused": this.isFocused ? "true" : "false"
    };
    s && (C["data-gutter-size"] = s), n && (C["data-disabled"] = "");
    const g = {
      name: t,
      placeholder: r,
      required: i,
      disabled: n
    };
    o && (g.pattern = o), u || (g.rows = l);
    const { allowAutofillExtensions: h } = e;
    return h === !1 && (g["data-lpignore"] = "true", g["data-1p-ignore"] = "true"), /* @__PURE__ */ c("div", { class: "_Container_zroze_1", ...C }, /* @__PURE__ */ c(
      "textarea",
      {
        class: "_Textarea_zroze_177",
        ...g,
        onInput: this.handleInput,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        ref: (f) => {
          this.textareaRef = f;
        }
      }
    ));
  }
};
s1(u3, "props", {
  name: String,
  defaultValue: String,
  required: Boolean,
  pattern: String,
  placeholder: String,
  autoSelect: Boolean,
  autoFocus: Boolean,
  disabled: Boolean,
  variant: String,
  size: String,
  gutterSize: String,
  rows: Number,
  autoResize: Boolean,
  maxRows: Number,
  allowAutofillExtensions: Boolean
});
s1(u3, "css", `${S}${M6}`);
u3 = A6([
  y("textarea-widget")
], u3);
var V6 = Object.defineProperty, $6 = Object.getOwnPropertyDescriptor, Z6 = (e, t, i) => t in e ? V6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, R6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? $6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, l1 = (e, t, i) => Z6(e, typeof t != "symbol" ? t + "" : t, i);
let p3 = class extends _ {
  selectedValue = "";
  /**
   * 组件安装后，初始化选中值
   */
  installed() {
    this.selectedValue = this.props.defaultValue || "", this.updateHostStyles();
    const e = this;
    e.value = this.selectedValue;
  }
  /**
   * 属性更新时，重新设置宿主元素样式
   */
  receiveProps() {
    return this.updateHostStyles(), !0;
  }
  /**
   * 根据属性设置宿主元素 data 属性
   */
  updateHostStyles() {
    const e = this;
    e && (e.setAttribute("data-w-component", "radiogroup"), this.props.name ? e.setAttribute("name", this.props.name) : e.removeAttribute("name"), this.props.direction ? e.setAttribute("data-direction", this.props.direction) : e.removeAttribute("data-direction"), this.props.disabled ? e.setAttribute("data-disabled", "") : e.removeAttribute("data-disabled"), this.props.required ? e.setAttribute("data-required", "true") : e.removeAttribute("data-required"));
  }
  /**
   * 对外暴露 value 属性，供表单数据收集使用
   */
  get value() {
    return this.selectedValue;
  }
  set value(e) {
    this.selectedValue = e;
  }
  /**
   * 处理单选按钮点击
   */
  handleRadioClick = (e) => {
    if (this.props.disabled)
      return;
    this.selectedValue = e;
    const t = this;
    t.value = e, this.update(), this.props.onChangeAction && (this.fire("changeAction", { value: e }), this.props.onChangeAction(e));
  };
  /**
   * 渲染单选按钮项
   */
  renderRadioItem(e, t) {
    const i = this.selectedValue === e.value, o = this.props.disabled || e.disabled, r = `${this.props.name || "radio"}-${t}`;
    return /* @__PURE__ */ c("div", { class: "flex" }, /* @__PURE__ */ c(
      "label",
      {
        for: r,
        class: "_RadioLabel_pjy8j_11",
        "data-disabled": o ? "" : void 0
      },
      /* @__PURE__ */ c("div", { class: "_RadioIndicatorWrapper_pjy8j_31" }, /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": i,
          "aria-disabled": o,
          "data-state": i ? "checked" : "unchecked",
          "data-disabled": o ? "" : void 0,
          value: e.value,
          id: r,
          class: "_RadioItem_pjy8j_50",
          tabindex: o ? -1 : 0,
          disabled: o,
          "data-radix-collection-item": "",
          onClick: () => this.handleRadioClick(e.value)
        },
        i && /* @__PURE__ */ c(
          "span",
          {
            "data-state": "checked",
            class: "_RadioIndicator_pjy8j_31"
          }
        )
      )),
      e.label
    ));
  }
  render(e) {
    const {
      direction: t = "row",
      disabled: i = !1,
      ariaLabel: o = "",
      required: r = !1,
      options: n = []
    } = e, a = {
      "data-direction": t
    };
    return i && (a["data-disabled"] = !0), r && (a["data-required"] = !0), /* @__PURE__ */ c(
      "div",
      {
        role: "radiogroup",
        "aria-required": r,
        dir: "ltr",
        class: "_RadioGroup_pjy8j_1",
        "aria-label": o,
        tabindex: 0,
        style: "outline: none;",
        ...a
      },
      n.map((d, s) => this.renderRadioItem(d, s))
    );
  }
};
l1(p3, "props", {
  name: String,
  defaultValue: String,
  direction: String,
  disabled: Boolean,
  ariaLabel: String,
  required: Boolean,
  options: Array,
  onChangeAction: Function
});
l1(p3, "css", `
    :host {
      display: inline-flex;
    }
    ${S}
  `);
p3 = R6([
  y("radiogroup-widget")
], p3);
var D6 = Object.defineProperty, T6 = Object.getOwnPropertyDescriptor, P6 = (e, t, i) => t in e ? D6(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i, B6 = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? T6(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
}, x3 = (e, t, i) => P6(e, typeof t != "symbol" ? t + "" : t, i);
const E6 = S.replace(/:root,[\s\n]*:host[\s\n]*\{/g, ":host {").replace(/:root,[\s\n]*:where\(/g, ":host, :where(").replace(/:where\(:root\),/g, ":host,").replace(/:is\(:root,/g, ":is(:host,").replace(/:is\(:where\(:root\),/g, ":is(:host,").replace(/:root[\s\n]*\{/g, ":host {").replace(/:where\(\[data-theme="light"\]\)/g, ':host([data-theme="light"])').replace(/:where\(\[data-theme="dark"\]\)/g, ':host([data-theme="dark"])'), z = {
  loading: !1,
  loaded: !1,
  promise: null,
  error: null
}, A = {
  loading: !1,
  loaded: !1,
  promise: null,
  error: null
};
let $ = class extends _ {
  lastRenderedJson = "";
  lastLocale = "";
  // 记录上次的 locale
  localeUnsubscribe = null;
  // 取消 locale 监听的函数
  isRendering = !1;
  // 🔥 防止重复渲染的标志
  componentRefs = /* @__PURE__ */ new Map();
  // 保存组件引用
  lastPropsMap = /* @__PURE__ */ new Map();
  // 保存上次的 props
  lastRenderedTimestamp = 0;
  // 记录上次派发事件的时间戳，防止重复派发
  isInstalled = !1;
  installed() {
    this.isInstalled = !0, this.lastRenderedJson = this.props["widget-json"] || "{}", this.lastLocale = T(), this.applyLocale(), this.localeUnsubscribe = z3((e) => {
      this.isInstalled && !this.isRendering && e !== this.lastLocale && (this.lastLocale = e, this.renderContent());
    }), this.renderContent();
  }
  /**
   * 组件卸载时清理 locale 监听
   */
  disconnectedCallback() {
    this.localeUnsubscribe && (this.localeUnsubscribe(), this.localeUnsubscribe = null);
  }
  /**
   * 应用 locale 设置
   * 如果传入了有效的 locale 属性，则设置全局语言
   */
  applyLocale() {
    const e = this.props.locale;
    if (e) {
      const t = _3(e);
      t && t !== this.lastLocale && (this.lastLocale = t, L3(t));
    }
  }
  updated() {
    if (!this.isInstalled)
      return;
    const e = this.props.locale;
    if (e) {
      const i = _3(e);
      if (i && i !== this.lastLocale) {
        this.lastLocale = i, L3(i), this.renderContent();
        return;
      }
    }
    (this.props["widget-json"] || "{}") !== this.lastRenderedJson && this.renderContent();
  }
  widgetConfig = null;
  /**
   * 设置 Form 元素的 submit 事件处理器
   */
  setupFormSubmitHandler(e, t) {
    const i = t["data-form-id"];
    if (!t["data-has-submit"] || !i) return;
    const r = window.__formSubmitCallbacks?.get(i);
    if (!r) return;
    const { onAction: n, collectFormDataFromDOM: a } = r, d = t["data-submit-action"];
    if (d)
      try {
        const s = JSON.parse(d);
        e._submitHandler && e.removeEventListener("submit", e._submitHandler), e._submitButtonClickHandler && e.querySelectorAll("button-widget").forEach((p) => {
          p.removeEventListener(
            "click",
            e._submitButtonClickHandler
          );
        });
        const {
          validateRequiredFields: l,
          showValidationTooltip: u,
          hideAllValidationTooltips: C
        } = r, g = (v) => {
          if (v.preventDefault(), C && C(e), l) {
            const w = l(e);
            if (!w.valid && w.firstInvalidElement) {
              u && u(
                w.firstInvalidElement,
                w.message || b("form.required")
              ), w.firstInvalidElement instanceof HTMLElement && w.firstInvalidElement.focus();
              return;
            }
          }
          const p = a(e), x = new CustomEvent("form-submit-success", {
            bubbles: !0
          });
          e.dispatchEvent(x), n({
            type: s.type,
            payload: {
              ...s.payload,
              ...p
            }
          });
        }, h = (v) => {
          const p = v.currentTarget, x = p.props?.submit === !0;
          if (p.tagName === "BUTTON-WIDGET" && x) {
            v.preventDefault(), v.stopPropagation();
            const w = new Event("submit", {
              bubbles: !0,
              cancelable: !0
            });
            e.dispatchEvent(w);
          }
        };
        e._submitHandler = g, e._submitButtonClickHandler = h, e.addEventListener("submit", g), e.querySelectorAll("button-widget").forEach((v) => {
          v.addEventListener("click", h);
        });
      } catch (s) {
        console.error("[Form] Failed to setup submit handler:", s);
      }
  }
  /**
   * 检测 widget 配置中是否包含 Chart 组件
   */
  hasChartComponent(e) {
    return e ? e.type === "Chart" ? !0 : e.children && Array.isArray(e.children) ? e.children.some(
      (t) => this.hasChartComponent(t)
    ) : !1 : !1;
  }
  /**
   * 检测 widget 配置中是否包含 Markdown 组件
   */
  hasMarkdownComponent(e) {
    return e ? e.type === "Markdown" ? !0 : e.children && Array.isArray(e.children) ? e.children.some(
      (t) => this.hasMarkdownComponent(t)
    ) : !1 : !1;
  }
  /**
   * 动态加载 Markdown Widget
   * 🔥 使用全局状态避免重复加载，支持加载失败降级
   */
  async loadMarkdownWidget() {
    if (!z.loaded) {
      if (z.loading && z.promise)
        return z.promise;
      if (!z.error) {
        if (customElements.get("markdown-widget")) {
          z.loaded = !0;
          return;
        }
        return z.loading = !0, z.promise = (async () => {
          try {
            console.log("🔄 Loading Markdown widget..."), (await import("./adp-widget-markdown.js")).registerMarkdownAdapter(R), z.loaded = !0, z.loading = !1, console.log("✅ Markdown widget loaded successfully");
          } catch (e) {
            z.loading = !1, z.error = e, console.error("❌ Failed to load Markdown widget:", e), this.registerMarkdownFallback();
          }
        })(), z.promise;
      }
    }
  }
  /**
   * 注册 Markdown 降级组件
   * 当 Markdown 加载失败时，显示纯文本内容
   */
  registerMarkdownFallback() {
    try {
      R.registerComponent("Markdown", {
        render: (e) => {
          const t = e.value || e.content || "";
          return {
            tag: "div",
            props: {
              style: {
                padding: "12px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "4px",
                color: "#856404"
              }
            },
            children: [
              {
                tag: "div",
                props: {
                  style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px"
                  }
                },
                text: b("widget.markdownLoadFailed")
              },
              {
                tag: "div",
                props: {
                  style: {
                    fontSize: "12px",
                    color: "#666",
                    marginBottom: "8px"
                  }
                },
                text: b("widget.plainTextFallback")
              },
              {
                tag: "pre",
                props: {
                  style: {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "13px",
                    margin: "0",
                    padding: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px"
                  }
                },
                text: t
              }
            ]
          };
        }
      }), console.log("Markdown fallback registered");
    } catch (e) {
      console.error("Failed to register Markdown fallback:", e);
    }
  }
  /**
   * 动态加载 Chart Widget
   * 🔥 使用全局状态避免重复加载，支持加载失败降级
   */
  async loadChartWidget() {
    if (!A.loaded) {
      if (A.loading && A.promise)
        return A.promise;
      if (!A.error) {
        if (customElements.get("chart-widget")) {
          A.loaded = !0;
          return;
        }
        return A.loading = !0, A.promise = (async () => {
          try {
            console.log("🔄 Loading Chart widget..."), (await import("./adp-widget-chart.js")).registerChartAdapter(R), A.loaded = !0, A.loading = !1, console.log("✅ Chart widget loaded successfully");
          } catch (e) {
            A.loading = !1, A.error = e, console.error("❌ Failed to load Chart widget:", e), this.registerChartFallback();
          }
        })(), A.promise;
      }
    }
  }
  /**
   * 注册 Chart 降级组件
   * 当 Chart 加载失败时，显示错误提示
   */
  registerChartFallback() {
    try {
      R.registerComponent("Chart", {
        render: (e) => ({
          tag: "div",
          props: {
            style: {
              padding: "12px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              color: "#856404",
              textAlign: "center"
            }
          },
          children: [
            {
              tag: "div",
              props: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "8px"
                }
              },
              text: b("widget.chartLoadFailed")
            },
            {
              tag: "div",
              props: {
                style: {
                  fontSize: "12px",
                  color: "#666"
                }
              },
              text: b("widget.chartType", {
                type: e.chartType || "unknown"
              })
            }
          ]
        })
      }), console.log("✓ Chart fallback registered");
    } catch (e) {
      console.error("Failed to register Chart fallback:", e);
    }
  }
  async renderContent() {
    if (!this.isRendering) {
      this.isRendering = !0;
      try {
        const e = this.props["widget-json"] || "{}";
        H3();
        const t = x1(e);
        if (!t.valid) {
          console.error(
            "[TdWidget] Widget 配置验证失败:",
            t.error
          ), this.lastRenderedJson = e, this.widgetConfig = {
            invalid: !0,
            errorMessage: t.error
          }, this.update(), this.dispatchRenderedEvent(
            !1,
            null,
            new Error(t.error || b("widget.invalidConfig"))
          );
          return;
        }
        const i = JSON.parse(e);
        if (H3(), this.lastRenderedJson = e, this.componentRefs.clear(), Object.keys(i).length === 0) {
          this.widgetConfig = null, this.update(), this.dispatchRenderedEvent(!0, i);
          return;
        }
        if (!i.type) {
          this.widgetConfig = null, this.update(), this.dispatchRenderedEvent(!0, i);
          return;
        }
        this.hasMarkdownComponent(i) && await this.loadMarkdownWidget(), this.hasChartComponent(i) && await this.loadChartWidget();
        const o = (n) => {
          const a = new CustomEvent("widget-action", {
            detail: { action: n },
            bubbles: !0,
            composed: !0
          });
          this.shadowRoot?.dispatchEvent(a);
        }, r = R.convert(
          i,
          o
        );
        this.widgetConfig = r, this.update(), requestAnimationFrame(() => {
          this.dispatchRenderedEvent(!0, i);
        });
      } catch (e) {
        console.error("[TdWidget] 渲染错误:", e), this.lastRenderedJson = this.props["widget-json"] || "{}", this.widgetConfig = {
          invalid: !0,
          errorMessage: e instanceof Error ? e.message : String(e)
        }, this.update(), this.dispatchRenderedEvent(!1, null, e);
      } finally {
        this.isRendering = !1;
      }
    }
  }
  /**
   * 派发渲染完成事件
   * @param success 是否渲染成功
   * @param config 渲染的配置对象
   * @param error 错误信息（如果有）
   */
  dispatchRenderedEvent(e, t, i) {
    const o = Date.now();
    if (o - this.lastRenderedTimestamp < 10)
      return;
    this.lastRenderedTimestamp = o;
    const r = new CustomEvent("widget-rendered", {
      detail: {
        success: e,
        config: t,
        error: i ? { message: i.message, stack: i.stack } : null,
        timestamp: o
      },
      bubbles: !1,
      // 🔥 不冒泡，避免被重复捕获
      composed: !0
      // 仍然穿透 Shadow DOM，让外部可以监听
    });
    this.dispatchEvent(r);
  }
  /**
   * 将 TdComponentConfig 转换为 Omi JSX 虚拟 DOM
   * 🔥 关键修复：defaultChecked 改变时强制重新创建元素
   * @param config - 组件配置
   * @param refKey - 引用键
   * @param parentDisable - 父组件是否被禁用（用于继承 disable 状态）
   *   - false: 不禁用（默认）
   *   - true: 禁用子组件
   *   - 'force-enable': 强制启用，忽略全局 disable
   */
  renderComponent(e, t = "root", i = !1) {
    const { tag: o, props: r = {}, attrs: n = {}, text: a, children: d, style: s } = e, l = { ...r, ...n }, u = i === "force-enable" ? !1 : this.props.disable || i;
    u && (o === "text-widget" && r.editable && typeof r.editable == "object" ? l.editable = {
      ...r.editable,
      disabled: !0
    } : o === "button-widget" || o === "clickable-widget" ? r.actionConfig?.alwaysEnabled !== !0 && l.disabled === void 0 && (l.disabled = !0) : o === "card-widget" ? l.disabled === void 0 && (l.disabled = !0) : $.DISABLEABLE_COMPONENTS.has(o) && l.disabled === void 0 && (l.disabled = !0)), o === "clickable-widget" && l.disabled === !0 && (l.disable = !0), o === "clickable-widget" && r.actionConfig?.alwaysEnabled === !0 && u && (l.disable = "force-enable"), s && Object.keys(s).length > 0 && (l.style = Object.entries(s).map(([h, f]) => `${h}: ${f}`).join("; "));
    const C = !o.startsWith("t-");
    if (o.startsWith("t-") || C) {
      const h = {
        ...l,
        style: s
        // 保留原始的 style 对象用于后续更新
      }, f = this.lastPropsMap.get(t) || {};
      if ("defaultChecked" in h && h.defaultChecked !== f.defaultChecked || "type" in h && h.type !== f.type) {
        const p = [t];
        "defaultChecked" in h && p.push(`checked-${h.defaultChecked}`), "type" in h && p.push(`type-${h.type}`), p.push(Date.now().toString()), l.key = p.join("-");
      }
      l.ref = (p) => {
        if (p) {
          const x = this.componentRefs.get(t), w = this.lastPropsMap.get(t) || {};
          this.componentRefs.set(t, p), this.lastPropsMap.set(t, h);
          const k = () => {
            Object.keys(h).forEach((m) => {
              if (m !== "ref" && m !== "class" && m !== "key") {
                const L = h[m], O = w[m];
                if ((m === "defaultChecked" && x !== p || // defaultChecked 只在新元素时设置
                m !== "defaultChecked" && L !== O) && typeof L < "u")
                  try {
                    if (m === "style")
                      if (typeof L == "object" && L !== null) {
                        const w3 = Object.entries(L).map(
                          ([d1, c1]) => `${d1}: ${c1}`
                        ).join("; ");
                        p.style.cssText = w3;
                      } else typeof L == "string" && (p.style.cssText = L);
                    else m.startsWith("data-") ? p.setAttribute(m, String(L)) : (p[m] = L, p.props && (p.props[m] = L));
                  } catch {
                  }
              }
            }), p.update && typeof p.update == "function" && p.update();
          };
          if (x === p) {
            if (k(), o === "form")
              this.setupFormSubmitHandler(p, h);
            else if (o === "textarea-widget") {
              if ("data-gutter-size" in h && h["data-gutter-size"] !== w["data-gutter-size"] && (p.gutterSize = h["data-gutter-size"] || ""), "data-variant" in h && h["data-variant"] !== w["data-variant"] && (p.variant = h["data-variant"] || "outline"), "data-auto-resize" in h) {
                const m = h["data-auto-resize"], L = w["data-auto-resize"];
                m !== L && (m === "true" ? p.setAttribute("data-auto-resize", "true") : p.setAttribute("data-auto-resize", "false"));
              }
              if ("data-max-rows" in h) {
                const m = h["data-max-rows"], L = w["data-max-rows"];
                m !== L && p.setAttribute("data-max-rows", String(m || "0"));
              }
              if ("data-auto-focus" in h) {
                const m = h["data-auto-focus"], L = w["data-auto-focus"];
                m !== L && p.setAttribute(
                  "data-auto-focus",
                  m === "true" ? "true" : "false"
                );
              }
              if ("data-auto-select" in h) {
                const m = h["data-auto-select"], L = w["data-auto-select"];
                m !== L && p.setAttribute(
                  "data-auto-select",
                  m === "true" ? "true" : "false"
                );
              }
            }
          } else
            setTimeout(() => {
              k(), o === "form" && this.setupFormSubmitHandler(p, h);
            }, 0);
        }
      };
    }
    let g = [];
    if (a && g.push(a), d && d.length > 0) {
      const h = l.disable === "force-enable" ? "force-enable" : l.disable === !0;
      g = g.concat(
        d.map(
          (f, v) => this.renderComponent(f, `${t}-${v}`, h)
        )
      );
    }
    return c(o, l, ...g);
  }
  render() {
    let e;
    return this.widgetConfig ? this.widgetConfig.invalid ? e = /* @__PURE__ */ c("div", { style: "color: red; padding: 20px;" }, b("widget.invalidWidget")) : this.widgetConfig.error ? e = /* @__PURE__ */ c("div", { style: "color: red; padding: 20px;" }, b("widget.renderFailed"), ": ", this.widgetConfig.error) : e = this.renderComponent(this.widgetConfig) : e = /* @__PURE__ */ c("div", { style: "color: #999; text-align: center; padding: 20px;" }, b("widget.noConfig")), /* @__PURE__ */ c("div", { class: "adp-widget-container" }, /* @__PURE__ */ c("div", { class: "adp-widget-preview" }, /* @__PURE__ */ c("div", { class: "_WidgetRenderer_kx556_1", "data-w-direction": "row" }, /* @__PURE__ */ c("div", null, e))));
  }
  /**
   * 注册自定义组件
   * @param type 组件类型名称
   * @param component 组件适配器实例（需实现 Adapter 接口）
   */
  static registerComponent(e, t) {
    R.registerComponent(e, t);
  }
  /**
   * 批量注册自定义组件
   * @param components 组件映射对象 { type: component }
   */
  static registerComponents(e) {
    R.registerComponents(e);
  }
};
x3($, "props", {
  "widget-json": {
    type: String,
    default: "{}"
  },
  disable: {
    type: Boolean,
    default: !1
  },
  locale: {
    type: String,
    default: ""
    // 空字符串表示使用全局设置
  }
});
x3($, "css", `
    /* 🔥 自定义主题样式（完全隔离在 Shadow DOM 内）*/
    ${E6}
    
    /* 🔥 自定义全局样式（完全隔离在 Shadow DOM 内）*/
    ${se}
    
    /* adp-widget 主容器样式 */
    /* 淡入淡出动画 */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    :host {
      display: block;
      width: 100%;
      min-height: 50px;
    }
    
    .adp-widget-container {
      width: 100%;
      box-sizing: border-box;
      min-height: 50px;
    }
    
    .adp-widget-preview {
      width: 100%;
      box-sizing: border-box;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `);
x3($, "DISABLEABLE_COMPONENTS", /* @__PURE__ */ new Set([
  "input-widget",
  "image-select-widget",
  "textarea-widget",
  "select-widget",
  "checkbox-widget",
  "radiogroup-widget",
  "date-picker-widget",
  "button-widget",
  "card-widget"
  // 🔥 新增：Card 组件需要将 disable 传递给内部按钮
]));
$ = B6([
  y("adp-widget")
], $);
typeof window < "u" && (window.TdWidget = {
  registerComponent: $.registerComponent.bind($),
  registerComponents: $.registerComponents.bind($)
});
export {
  $ as default
};
