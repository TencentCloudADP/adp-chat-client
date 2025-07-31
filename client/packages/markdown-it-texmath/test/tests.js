"use strict";
const tests = [
{ valid: true,
  src: "\\(E_k=?\\)",
  comment: "single character inline equation."
},
{ valid: true,
  src: "$E_k=?$",
  comment: "single character inline equation."
},
{ valid: true,
  src: "\\[E_k=?\\]",
  comment: "single character inline equation."
},
{ valid: false,
  src: "```\n\\(E_k=?\\)\n```",
  comment: ""
},
{ valid: false,
  src: "```\n$E_k=?$\n```",
  comment: ""
},
{ valid: false,
  src: "```\n\\[E_k=?\\]\n```",
  comment: ""
},
{ valid: false,
  src: "`\n\\(E_k=?\\)\n`",
  comment: ""
},
{ valid: false,
  src: "`\n$E_k=?$\n`",
  comment: ""
},
{ valid: false,
  src: "`\n\\[E_k=?\\]\n`",
  comment: ""
},
{ valid: true,
  src: "\\begin{align}\nx &= y + z \\\\\na &= b \\times c\n\\end{align}",
  comment: ""
},
{ valid: true,
  src: "通过光电效应实验测量普朗克常数的核心步骤如下，基于爱因斯坦光电效应方程 \\(E_k = h\\nu - W_0\\)（其中\\(E_k\\)为光电子最大初动能，\\(h\\)为普朗克常数，\\(\\nu\\)为入射光频率，\\(W_0\\)为金属逸出功）：\n\n### **实验原理**\n1. **爱因斯坦方程验证**：光电子的最大动能 \\(E_k\\) 与入射光频率 \\(\\nu\\) 呈线性关系，斜率即为普朗克常数 \\(h\\)，截距为逸出功 \\(W_0\\)。\n2. **截止电压法**：通过测量使光电流降为零的反向电压（截止电压 \\(U_c\\)），利用 \\(E_k = eU_c\\)（\\(e\\)为电子电荷量）间接获得电子动能。\n\n### **实验装置**\n- **光源**：可调频单色光源（如汞灯+滤光片或LED激光系统），提供不同频率的光。\n- **光电管**：真空管内含金属阴极（如钠、锌）和阳极，用于产生光电流。\n- **测量系统**：可调电源、电压表、微电流计，用于测量截止电压和光电流。\n\n### **关键步骤**\n1. **调节频率**：用不同频率的单色光照射阴极，确保频率大于材料的红限频率。\n2. **测量截止电压**：对每种频率，调节反向电压至光电流为零，记录 \\(U_c\\)。\n3. **数据处理**：\n   - 计算动能：\\(E_k = eU_c\\)。\n   - 绘制 \\(E_k\\)-\\(\\nu\\) 图或直接绘制 \\(U_c\\)-\\(\\nu\\) 图，拟合直线。\n   - 普朗克常数 \\(h = e \\cdot k\\)（\\(k\\)为直线斜率），逸出功 \\(W_0 = -e \\cdot b\\)（\\(b\\)为截距）。\n\n### **注意事项**\n- **误差控制**：暗电流、接触电势差需校准；光源单色性和稳定性影响精度。\n- **现代改进**：采用LED光源+PWM调光可提高波长稳定性和操作便捷性。\n\n### **示例结果**\n若拟合直线为 \\(U_c = (4.14 \\times 10^{-15})\\nu - 1.0\\)（单位：V·s），则：\n\\[ h = e \\times 4.14 \\times 10^{-15} \\approx 6.63 \\times 10^{-34} \\, \\text{J·s} \\]\n与公认值吻合。",
  comment: "single character inline equation."
},
{ valid: true,
  src: "$a$",
  comment: "single character inline equation."
},
{ valid: true,
  src: "$\\varphi$",
  comment: "inline equation with single greek character"
},
{ valid: true,
  src: "$1+1=2$",
  comment: "simple equation starting and ending with numbers."
},
{ valid: true,
  src: "$1+1<3$",
  comment: "simple equation including special html character."
},
{ valid: true,
  src: "$a \\backslash$",
  comment: "equation including backslashes."
},
{ valid: true,
  src: "You get 3$ if you solve $1+2$",
  comment: "use of currency symbol"
},
{ valid: true,
  src: "If you solve $1+2$ you get $3",
  comment: "use of currency symbol"
},
{ valid: true,
  src: "$\\frac{1}{2}$",
  comment: "inline fraction"
},
{ valid: true,
  src: "$\\begin{pmatrix}x\\\\y\\end{pmatrix}$",
  comment: "inline column vector"
},
{ valid: true,
  src: "${\\tilde{\\bold e}}_\\alpha$",
  comment: "inline bold vector notation"
},
{ valid: true,
  src: "$a^{b}$",
  comment: "exponentiation"
},
{ valid: true,
  src: "$a^\*b$ with $a^\*$",
  comment: "conjugate complex"
},
{ valid: true,
  src: "$$e_\\alpha$$",
  comment: "single block equation, greek index"
},
{ valid: true,
  src: "$$1+1=2$$",
  comment: "display equation on its own single line."
},
{ valid: true,
  src: "${e}_x$\n\n$$e_\\alpha$$",
  comment: "inline equation followed by block equation."
},
{ valid: true,
  src: "$$c{\\bold e}_x = a{\\bold e}_\\alpha - b\\tilde{\\bold e}_\\alpha$$",
  comment: "underline tests"
},
{ valid: true,
  src: "a$1+1=2$\n$1+1=2$b\nc$x$d",
  comment: "non-numeric character before opening $ or\nafter closing $ or both is allowed."
},
{ valid: true,
  src: "$x$ $ ",
  comment: "following dollar character '$' is allowed."
},
{ valid: true,
  src: "$x$ $y$",
  comment: "consecutive inline equations."
},
{ valid: true,
  src: "so-what is $x$",
  comment: "inline equation after '-' sign in text."
},
{ valid: true,
  src: "$$\n1+1=2\n$$",
  comment: "display equation with line breaks."
},
{ valid: true,
  src: "$$\\begin{matrix}\n f & = & 2 + x + 3 \\\\\n & = & 5 + x \n\\end{matrix}$$",
  comment: "multiline equation."
},
{ valid: true,
  src: "$$\\begin{pmatrix}x_2 \\\\ y_2 \\end{pmatrix} = \n\\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix}\\cdot\n\\begin{pmatrix} x_1 \\\\ y_1 \\end{pmatrix}$$",
  comment: "vector equation."
},
{ valid: true,
  src: "$$f(x) = x^2 - 1$$ (1)",
  comment: "display equation with equation number."
},
{ valid: true,
  src: "`code`$a-b$",
  comment: "inline equation following code section."
},
{ valid: true,
  src: "```\ncode\n```\n$$a+b$$",
  comment: "equation following code block."
},
{ valid: true,
  src: "```\ncode\n```\n$$a+b$$(1)",
  comment: "numbered equation following code block."
},
{ valid: true,
  src: "1. $1+2$\n2. $2+3$\n    1. $3+4$",
  comment: "Equations in list."
},
{ valid: true,
  src: "$\\sum\_{i=1}^n$",
  comment: "Inline sum."
},
{ valid: true,
  src: "$$\\sum\_{i=1}^n$$",
  comment: "Sum without equation number."
},
{ valid: true,
  src: "$$\\sum\_{i=1}\^n$$ \(2\)",
  comment: "Sum with equation number."
},
{ valid: true,
  src: "$${\\bold e}(\\varphi) = \\begin{pmatrix}\n\\cos\\varphi\\\\\\sin\\varphi\n\\end{pmatrix}$$ (3)",
  comment: "equation number always vertically aligned."
},
{ valid: true,
  src: "> see $a = b + c$ \n> $c^2=a^2+b^2$ (2) \n> $c^2=a^2+b^2$ ",
  comment: "inline equations in blockquote."
},
{ valid: true,
  src: "> formula\n>\n> $$ a+b=c$$ (2)\n>\n> in blockquote. ",
  comment: "display equation in blockquote."
},
{ valid: true,
  src: "\\$1+1=2$\n$1+1=2\\$",
  comment: "escaped dollars '\\$' are interpreted as\ndollar '$' characters."
},
{ valid: false,
  src: "> \$\$ a+b\n=c\$\$",
  comment: "new line in blockquote block."
},
{ valid: false,
  src: "some text\n \$\\$a+b=c\$\$",
  comment: "empty line between text and display formula is required."
},
{ valid: false,
  src: "$ $\n$ x$\n$x $",
  comment: "whitespace character after opening $\nor before closing $ is not allowed."
},
{ valid: false,
  src: "$1+1=\n2$",
  comment: "line break in inline equation is not allowed."
}
]

if (typeof module === "object" && module.exports)
   module.exports = tests;
