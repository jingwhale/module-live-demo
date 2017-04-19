/**
 * --基础公式编辑UI---
 * 
 * @version 1.0
 * @author hzliufh(hzliufh@corp.netease.com)
 * ------------------------------------------------------------
 */
define([
	'{lib}ui/base.js',
	'pool/edu-front-util/src/domUtil',
	'text!./mathEdit.html'
], function(
	_base,
	_domUtil,
	_template,
	_p, _o, _f, _r) {

	var g = window,
		o = NEJ.O,
		f = NEJ.F,
		e = NEJ.P('nej.e'),
		u = NEJ.P('nej.u'),
		v = NEJ.P('nej.v'),
		p = NEJ.P('nej.ui'),
		j = NEJ.P('nej.j'),
		__proMathEditUI,
		__supMathEditUI;
	
	// base constant
	var m_math = ["\\widetilde{ab}", "\\overline{ab}", "\\overbrace{ab}", "\\sqrt{ab}", "f'", "x^{k}", "\\lim_{a \\rightarrow b}", "\\begin{bmatrix}a & b \\\\c & d \\end{bmatrix}", "\\big(a\\big)", "\\int_a^b x", "\\sum_a^b x", "\\prod_a^b x", "\\bigcap_a^b x", "\\bigvee_a^b x", "\\bigotimes", "\\widehat{ab}", "\\underline{ab}", "\\underbrace{ab}", "\\sqrt[n]{ab}", "\\frac{a}{b}", "x_{k}", "\\frac{\\partial^nf}{\\partial x^n}", "x =\\begin{cases}a & x = 0\\\\b & x > 0\\end{cases}", "\\big\\{a\\big\\}", "\\oint_a^b x", "\\bigsqcup_a^b x", "\\coprod_a^b x", "\\bigcup_a^b x", "\\bigwedge_a^b x", "\\bigoplus"];
	var m_greek = ["\\alpha", "\\beta", "\\gamma", "\\delta", "\\epsilon", "\\varepsilon", "\\zeta", "\\eta", "\\theta", "\\vartheta", "\\gamma", "\\kappa", "\\lambda", "\\mu", "\\nu", "\\xi", "o", "\\pi", "\\varpi", "\\rho", "\\varrho", "\\sigma", "\\varsigma", "\\tau", "\\upsilon", "\\phi", "\\varphi", "\\chi", "\\psi", "\\omega", "\\Gamma", "\\Delta", "\\Theta", "\\Lambda", "\\Xi", "\\Pi", "\\Sigma", "\\Upsilon", "\\Phi", "\\Psi", "\\Omega", "\\$"];
	var m_rel = ["\\leq", "\\prec", "\\preceq", "\\ll", "\\subset", "\\subseteq", "\\sqsubset", "\\sqsubseteq", "\\in", "\\vdash", ">", "\\smile", "\\sim", "\\asymp", "\\equiv", "\\mid", "\\neq", "\\perp", ":", "\\geq", "\\succ", "\\succeq", "\\gg", "\\supset", "\\supseteq", "\\sqsupset", "\\sqsupseteq", "\\ni", "\\dashv", "<", "\\frown", "\\simeq", "\\approx", "\\parallel", "\\propto"];
	var m_logic = ["\\hat{a}", "\\acute{a}", "\\bar{a}", "\\dot{a}", "\\breve{a}", "\\check{a}", "\\grave{a}", "\\vec{a}", "\\ddot{a}", "\\tilde{a}", "+", "\\times", "\\cap", "\\cup", "\\vee", "\\setminus", "\\bigtriangleup", "\\triangleright", "\\oplus", "\\otimes", "\\odot", "\\uplus", "\\ast", "\\circ", "-", "\\div", "\\sqcup", "\\sqcap", "\\wedge", "\\wr", "\\bigtriangledown", "\\triangleleft", "\\ominus", "\\oslash", "\\bigcirc", "\\amalg", "\\star", "\\bullet"];
	var m_symbol = ["\\ldots", "\\vdots", "\\mp", "\\times", "/", "|", "\\imath", "\\nabla", "\\top", "\\forall", "\\neg", "\\partial", "\\Re", "\\aleph", "\\ell", "\\wp", "\\prime", "\\surd", "\\natural", "\\clubsuit", "\\cdots", "\\ddots", "\\pm", "\\div", "\\backslash", "\\|", "\\jmath", "\\triangle", "\\bot", "\\exists", "\\flat", "\\infty", "\\Im", "\\hbar", "\\emptyset", ".", "\\angle", "\\sharp", "\\Diamond", "\\spadesuit"];
	var m_arrow = ["\\leftarrow", "\\Leftarrow", "\\leftrightarrow", "\\mapsto", "\\leftharpoonup", "\\rightharpoonup", "\\longleftarrow", "\\Longleftarrow", "\\longleftrightarrow", "\\uparrow", "\\downarrow", "\\updownarrow", "\\rightleftharpoons", "\\nearrow", "\\searrow", "\\rightarrow", "\\Rightarrow", "\\Leftrightarrow", "\\leftharpoondown", "\\rightharpoondown", "\\longrightarrow", "\\Longrightarrow", "\\Longleftrightarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "\\nwarrow", "\\swarrow"];

	var m_math_rect = ["2,2,29,47", "31,2,58,47", "60,2,87,47", "89,2,119,47", "121,2,148,47", "150,2,177,47", "179,2,214,47", "216,2,314,47", "316,2,344,47", "346,2,378,47", "380,2,420,47", "422,2,459,47", "461,2,493,47", "495,2,527,47", "529,2,556,47", "2,49,29,94", "31,49,58,94", "60,49,87,94", "89,49,119,94", "121,49,148,94", "150,49,177,94", "179,49,214,94", "216,49,314,94", "316,49,344,94", "346,49,378,94", "380,49,420,94", "422,49,459,94", "461,49,493,94", "495,49,527,94", "529,49,556,94"];
	var m_greek_rect = ["2,2,29,22", "31,2,58,22", "60,2,87,22", "89,2,116,22", "118,2,145,22", "147,2,174,22", "176,2,203,22", "205,2,232,22", "234,2,261,22", "263,2,290,22", "292,2,319,22", "321,2,348,22", "350,2,377,22", "379,2,406,22", "408,2,435,22", "437,2,464,22", "466,2,493,22", "495,2,522,22", "524,2,551,22", "553,2,580,22", "582,2,609,22", "2,24,29,44", "31,24,58,44", "60,24,87,44", "89,24,116,44", "118,24,145,44", "147,24,174,44", "176,24,203,44", "205,24,232,44", "234,24,261,44", "263,24,290,44", "292,24,319,44", "321,24,348,44", "350,24,377,44", "379,24,406,44", "408,24,435,44", "437,24,464,44", "466,24,493,44", "495,24,522,44", "524,24,551,44", "553,24,580,44", "582,24,609,44"];
	var m_rel_rect = ["2,2,29,28", "31,2,58,28", "60,2,87,28", "89,2,116,28", "118,2,145,28", "147,2,174,28", "176,2,203,28", "205,2,232,28", "234,2,261,28", "263,2,290,28", "292,2,319,28", "321,2,348,28", "350,2,377,28", "379,2,406,28", "408,2,435,28", "437,2,464,28", "466,2,493,28", "2,30,29,51", "31,30,58,51", "60,30,87,51", "89,30,116,51", "118,30,145,51", "147,30,174,51", "176,30,203,51", "205,30,232,51", "234,30,261,51", "263,30,290,51", "292,30,319,51", "321,30,348,51", "350,30,377,51", "379,30,406,51", "408,30,435,51", "437,30,464,51", "466,30,493,51", "495,30,522,51"];
	var m_logic_rect = ["2,2,29,24", "31,2,58,24", "60,2,87,24", "89,2,116,24", "118,2,145,24", "147,2,174,24", "176,2,203,24", "205,2,232,24", "234,2,261,24", "263,2,290,24", "292,2,319,24", "321,2,348,24", "350,2,377,24", "379,2,406,24", "408,2,435,24", "437,2,464,24", "466,2,493,24", "495,2,522,24", "524,2,551,24", "2,26,29,52", "31,26,58,52", "60,26,87,52", "89,26,116,52", "118,26,145,52", "147,26,174,52", "176,26,203,52", "205,26,232,52", "234,26,261,52", "263,26,290,52", "292,26,319,52", "321,26,348,52", "350,26,377,52", "379,26,406,52", "408,26,435,52", "437,26,464,52", "466,26,493,52", "495,26,522,52", "524,26,551,52"];
	var m_symbol_rect = ["2,2,29,26", "31,2,58,26", "60,2,87,26", "89,2,116,26", "118,2,145,26", "147,2,174,26", "176,2,203,26", "205,2,232,26", "234,2,261,26", "263,2,290,26", "292,2,319,26", "321,2,348,26", "350,2,377,26", "379,2,406,26", "408,2,435,26", "437,2,464,26", "466,2,493,26", "495,2,522,26", "524,2,551,26", "553,2,580,26", "2,28,29,54", "31,28,58,54", "60,28,87,54", "89,28,116,54", "118,28,145,54", "147,28,174,54", "176,28,203,54", "205,28,232,54", "234,28,261,54", "263,28,290,54", "292,28,319,54", "321,28,348,54", "350,28,377,54", "379,28,406,54", "408,28,435,54", "437,28,464,54", "466,28,493,54", "495,28,522,54", "524,28,551,54", "553,28,580,54"];
	var m_arrow_rect = ["2,2,29,25", "31,2,58,25", "60,2,87,25", "89,2,116,25", "118,2,145,25", "147,2,174,25", "176,2,214,25", "216,2,254,25", "256,2,294,25", "296,2,323,25", "325,2,352,25", "354,2,381,25", "383,2,410,25", "412,2,439,25", "2,27,29,50", "31,27,58,50", "60,27,87,50", "89,27,116,50", "118,27,145,50", "147,27,174,50", "176,27,214,50", "216,27,254,50", "256,27,294,50", "296,27,323,50", "325,27,352,50", "354,27,381,50", "383,27,410,50", "412,27,439,50"];
	
	var s_algebra = ["\\left(x-1\\right)\\left(x+3\\right)", "\\sqrt{a^2+b^2}", "x = a_0 + \\frac{1}{a_1 + \\frac{1}{a_2 + \\frac{1}{a_3 + a_4}}}", "x = a_0 + \\frac{1}{\\displaystyle a_1 + \\frac{1}{\\displaystyle a_2 + \\frac{1}{\\displaystyle a_3 + a_4}}}", "\\sqrt{\\frac{x^2}{k+1}}\\qquad\nx^{\\frac{2}{k+1}}\\qquad\n\\frac{\\partial^2f}{\\partial x^2}"];
	var s_calculus = ["\\frac{\\partial y}{\\partial x}", "\\frac{d}{dx}c^n=nx^{n-1}", "\\frac{d}{dx}e^{ax}=a\\,e^{ax}", "\\frac{d}{dx}\\ln(x)=\\frac{1}{x}", "\\frac{d}{dx}\\sin x=\\cos x", "a_i^2 + b_j^2 = c_k^2"];
	var s_stats = ["{^n}C_r", "\\frac{n!}{r!(n-r)!}", "\\sum_{i=1}^{n}{X_i}", "\\sum_{i=1}^{n}{X_i^2}", "\\sum_{i=1}^{n}{(X_i - \\overline{X})^2}", "X_1, \\cdots,X_n", "\\frac{x-\\mu}{\\sigma}"];
	var s_set = ["\\bigcup_{i=1}^{n}{X_i}", "\\bigcap_{i=1}^{n}{X_i}"];
	var s_trig = ["\\cos^{-1}\\theta", "\\sin^{-1}\\theta", "e^{i \\theta}", "\\left(\\frac{\\pi}{2}-\\theta \\right )", "\\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}", "\\int_{0}^{\\pi} \\sin x \\, dx = 2"];
	var s_physics = ["\\vec{F}=m\\vec{a}", "e=m c^2", "\\vec{F}=m \\frac{d \\vec{v}}{dt} + \\vec{v}\\frac{dm}{dt}", "\\oint \\vec{F} \\cdot d\\vec{s}=0", "\\vec{F}_g=-F\\frac{m_1 m_2}{r^2} \\vec{e}_r"];
	var s_matrices = ["\\begin{pmatrix}\n a_{11} & a_{12} \\\\\n a_{21} & a_{22}\n \\end{pmatrix}", "\\begin{pmatrix}\n a_{11} & a_{12} & a_{13}\\\\\n a_{21} & a_{22} & a_{23}\\\\\n a_{31} & a_{32} & a_{33}\n \\end{pmatrix}", "\\begin{pmatrix}\n a_{11} & \\cdots & a_{1n}\\\\\n \\vdots & \\ddots & \\vdots\\\\\n a_{m1} & \\cdots & a_{mn}\n \\end{pmatrix}", "\\begin{pmatrix}\n 1 & 0 \\\\\n 0 & 1\n \\end{pmatrix}", "\\mathbf{X} = \\left(\n\\begin{array}{ccc}\nx_1 & x_2 & \\ldots \\\\\nx_3 & x_4 & \\ldots \\\\\n\\vdots & \\vdots & \\ddots\n\\end{array} \\right)"];
	var s_chemistry = ["_{10}^{5}C^{16}", "2H_2 + O_2 {\\overset{n,m}{\\longrightarrow}} 2H_2O", "A\\underset{b}{\\overset{a}{\\longleftrightarrow}}B", "A\\underset{0}{\\overset{a}{\\rightleftharpoons}}B", "A\\underset{0^{\\circ}C }{\\overset{100^{\\circ}C}{\\rightleftharpoons}}B"];
	var samples = ["\\left(x-1\\right)\\left(x+3\\right)", "\\sqrt{a^2+b^2}", "a_i^2 + b_j^2 = c_k^2", "\\sum_{i=1}^{n} x_{i}^{2}", "x = a_0 + \\frac{1}{a_1 + \\frac{1}{a_2 + \\frac{1}{a_3 + a_4}}}", "x = a_0 + \\frac{1}{\\displaystyle a_1 + \\frac{1}{\\displaystyle a_2 + \\frac{1}{\\displaystyle a_3 + a_4}}}", "\\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}", "\\int_{0}^{\\pi} \\sin x \\, dx = 2", "\\frac{d}{d\\theta} \\sin(\\theta) = \\cos(\\theta)", "\\mathbf{X} = \\left(\n\\begin{array}{ccc}\nx_1 & x_2 & \\ldots \\\\\nx_3 & x_4 & \\ldots \\\\\n\\vdots & \\vdots & \\ddots\n\\end{array} \\right)"];
	
	var m_normal_img = {
			'math'			: 'http://img2.ph.126.net/G3MYoLa9g8WpKl0TWAYyWg==/2019301483022554715.png',
			'greek'			: 'http://img2.ph.126.net/EbQDQuKuBYrlS0rZFWpbkg==/6608780665003467926.png',
			'rel'			: 'http://img0.ph.126.net/Vt7_hp2xQXJwCaN-oTa8LQ==/6598205562169887885.png',
			'symbol'		: 'http://img2.ph.126.net/crG-r_w69oeg_2wCfkWEww==/6597704184867699980.png',
			'logic'			: 'http://img0.ph.126.net/whnMeWV_WxAoCQg7SHssvQ==/3190237386138797667.png',
			'arrow'			: 'http://img2.ph.126.net/VxmY-43B8jqHNx22w8cG4g==/6597543656170048310.png',
			'Algebra_1'		: 'http://img2.ph.126.net/UQihbSjorHPa6M66y7-liQ==/4791830003622446441.png',
			'Algebra_2'		: 'http://img0.ph.126.net/IzWfQsPlWxSi1QXN-RYc1w==/1448470230253357794.png',
			'Algebra_3'		: 'http://img1.ph.126.net/b0ogK2TTM1hypDoGyOBfeQ==/6597202807565753503.png',
			'Algebra_4'		: 'http://img1.ph.126.net/b0ogK2TTM1hypDoGyOBfeQ==/6597202807565753503.png',
			'Algebra_5'		: 'http://img1.ph.126.net/jEloIOEsTGw5hrHl-DTjvA==/1882223169364789588.png',
			'Calculus_1'	: 'http://img2.ph.126.net/qi61tho2IlM3J5q118SkiA==/2053359955204861724.png',
			'Calculus_2'	: 'http://img0.ph.126.net/7hITU95jGVKjr5lvcxVDEg==/3159838088654437749.png',
			'Calculus_3'	: 'http://img2.ph.126.net/mHoke2y1Q7QjOy7SdSZ_bA==/87820192833871898.png',
			'Calculus_4'	: 'http://img2.ph.126.net/fI37iu4MldT2mdoABt9K6w==/2854156263946906340.png',
			'Calculus_5'	: 'http://img2.ph.126.net/jtOULAW0EmkntU4MvuHnsg==/2633479882122969578.png',
			'Calculus_6'	: 'http://img1.ph.126.net/qzuBICz13K1qpSzoQFEhgw==/6597497476680500014.png',
			'Stats_1'		: 'http://img2.ph.126.net/dpDV5xCKNH050M7BIW6T6A==/4835177150035861754.png',
			'Stats_2'		: 'http://img0.ph.126.net/oFsmSZ2k1P_oCgRuNRrEtA==/6598094511495507735.png',
			'Stats_3'		: 'http://img1.ph.126.net/F6cGevZA6tOMA477y-EJIw==/1139410705825566685.png',
			'Stats_4'		: 'http://img1.ph.126.net/hkUSozEU_O-rw6zo0P3jqw==/708191041504319116.png',
			'Stats_5'		: 'http://img2.ph.126.net/Ou4e4KkpHL2y22aAPI1GfA==/6597477685471200077.png',
			'Stats_6'		: 'http://img0.ph.126.net/HIIq-iI-LoFZuouian8VrA==/1334191389626577906.png',
			'Stats_7'		: 'http://img1.ph.126.net/-AMAzTlNvtLoSvcAAq4xag==/6597636015146779870.png',
			'Set_1'			: 'http://img2.ph.126.net/aWNb4VxJOD7Pn0C7csEFiQ==/6597900997449074369.png',
			'Set_2'			: 'http://img2.ph.126.net/N1hBtCFPi4_hNZMTGF-lqg==/6598112103681548699.png',
			'Trig_1'		: 'http://img1.ph.126.net/QQQjrBesRuHbT8rOcZhhRw==/1825365224069039284.png',
			'Trig_2'		: 'http://img0.ph.126.net/zaRh16mtMcmxj5WPl7iq_A==/6608681708956968093.png',
			'Trig_3'		: 'http://img0.ph.126.net/JUJwy5K4ydQjL45U33jIDA==/6608636628980229456.png',
			'Trig_4'		: 'http://img0.ph.126.net/Fa6bgqR8qKjyPn-9OCQAlw==/1984680060887425938.png',
			'Trig_5'		: 'http://img1.ph.126.net/dTjZ0NFeHdeETG0neihOVg==/6598164880239685021.png',
			'Trig_6'		: 'http://img1.ph.126.net/kx9we2exD1W7hnP8s2-ArA==/6608426622260169550.png',
			'Physics_1'		: 'http://img2.ph.126.net/43GWnpj4030o8j0wGJYLiw==/720294465502878278.png',
			'Physics_2'		: 'http://img1.ph.126.net/CgJGzVVVHP8gocLayZ6sUg==/6608487095398851985.png',
			'Physics_3'		: 'http://img1.ph.126.net/ZtYA5oW2muRdKSN1XjGm9Q==/1745707805659777441.png',
			'Physics_4'		: 'http://img2.ph.126.net/_jnhyNKizoeocDqpCVyOvg==/1756685329751488529.png',
			'Physics_5'		: 'http://img0.ph.126.net/DQ9-kxDlyFrdFuQDGyNAbg==/6597675597565382544.png',
			'Matrices_1'	: 'http://img0.ph.126.net/To5ah5g69Lp1LdoU5yguiA==/2262495862900545069.png',
			'Matrices_2'	: 'http://img2.ph.126.net/72lTyMExzTUXky6BddxNLQ==/1413848808118630055.png',
			'Matrices_3'	: 'http://img1.ph.126.net/oDZp9cT2eCZzOvx2uG7NNg==/6597141234914598082.png',
			'Matrices_4'	: 'http://img0.ph.126.net/AJBcQbQzSAxZOnf6RD23ZQ==/6597198409519248396.png',
			'Matrices_5'	: 'http://img2.ph.126.net/jQ8sb2aftHq6wamn_l4PPQ==/6608562961701168488.png',
			'Chemistry_1'	: 'http://img1.ph.126.net/vJN63vEddPmjwgWa7dqtAg==/1916000166570022513.png',
			'Chemistry_2'	: 'http://img2.ph.126.net/h6ZPvjlo7HAwJ_iLQK2uQw==/2057863554832177238.png',
			'Chemistry_3'	: 'http://img1.ph.126.net/uMzxgfryIOeJE1K7yXSDJw==/1709679008641115020.png',
			'Chemistry_4'	: 'http://img0.ph.126.net/ADxwUfbFWhPc18OCkDSh-Q==/6597869111611873233.png',
			'Chemistry_5'	: 'http://img0.ph.126.net/cO7plxf5gtWSbNAL8yuF3g==/1409908158444404259.png'
	}
	/**
	 * 公式编辑UI控件
	 * 
	 * @class 公式编辑控件
	 * @extends edu.u._$$UIBase
	 * @param {Object}
	 *    _options 可选配置参数，已处理参数列表如下所示
	 */
	
	var _htmlTpl = e._$addHtmlTemplate(_template);
		

    p._$$MathEditUI = NEJ.C();
	__proMathEditUI = p._$$MathEditUI._$extend(p._$$Abstract, true);
	__supMathEditUI = p._$$MathEditUI._$supro;

	/**
	 * 初始化外观信息
	 */
	__proMathEditUI.__initXGui = function() {
		this.__seed_html = e._$addNodeTemplate(e._$getHtmlTemplate(_htmlTpl));
		//this.__seed_css = _seed_css;
	};
	
	/**
	 * 初始化节点
	 * @return {Void}
	 */
	__proMathEditUI.__initNode = function() {
		this.__supInitNode();
		this.__items            = e._$getByClassName(this.__body,"j-item");
		this.__eqitems          = e._$getByClassName(this.__body,"j-eqitem");
		
		this.__latexSrc         = e._$getByClassName(this.__body,"j-latexSrc")[0];
		this.__latexMsg         = e._$getByClassName(this.__body,"j-latexMsg")[0];
		this.__latexImg         = e._$getByClassName(this.__body,"j-latexImg")[0];
		
		this.__previewBtn       = e._$getByClassName(this.__body,"j-preview")[0];
		
		v._$addEvent(this.__previewBtn, 'click', this.__getMathimage._$bind(this));
	};
	
	/**
     * 控件销毁
     * @return {Void}
     */
	__proMathEditUI.__destroy = function(){
		this.__latexImg.src = "";
		this.__latexSrc.value = "";
		this.__latexMsg.innerText = "";
		u._$forEach(this.__eqitems, function(_item, _index){
			_item.innerHTML = "";
		}._$bind(this));
		this.__supDestroy();
    }
	
	/**
	 * 重置控件
	 * @param {Object} _options
	 */
	__proMathEditUI.__reset = function(_options) {
		this.__supReset(_options);
		this.__genHtmlStruct();

		_domUtil._$hiddenNode(this.__latexImg);
	};
	
	/**
	 * 生成html结构
	 */
	__proMathEditUI.__genHtmlStruct = function(){
		this.__makeImgTable(this.__eqitems[0], m_math, m_math_rect, 'math');
		this.__makeImgTable(this.__eqitems[1], m_greek, m_greek_rect, 'greek');
		this.__makeImgTable(this.__eqitems[2], m_rel, m_rel_rect, 'rel');
		this.__makeImgTable(this.__eqitems[3], m_symbol, m_symbol_rect, 'symbol');
		this.__makeImgTable(this.__eqitems[4], m_logic, m_logic_rect, 'logic');
		this.__makeImgTable(this.__eqitems[5], m_arrow, m_arrow_rect, 'arrow');
		
		u._$forEach(this.__items, function(_item, _index){
			v._$addEvent(_item,'mouseover',this.__showHideHandle._$bind(this,true,_index));
			v._$addEvent(_item,'mouseout', this.__showHideHandle._$bind(this,false,_index));
		}._$bind(this));
		
		this.__areaitems = e._$getByClassName(this.__body, 'j-areaitem');
		u._$forEach(this.__areaitems, function(_item, _index){
			v._$addEvent(_item, 'click', this.__onAreaClick._$bind(this,_item));
		}._$bind(this));
		
		this.__eqitems[6].innerHTML = this.__makeSample(s_algebra,'Algebra');
		this.__eqitems[7].innerHTML = this.__makeSample(s_calculus,'Calculus');
		this.__eqitems[8].innerHTML = this.__makeSample(s_stats,'Stats');
		this.__eqitems[9].innerHTML = this.__makeSample(s_set,'Set');
		this.__eqitems[10].innerHTML = this.__makeSample(s_trig,'Trig');
		this.__eqitems[11].innerHTML = this.__makeSample(s_physics,'Physics');
		this.__eqitems[12].innerHTML = this.__makeSample(s_matrices,'Matrices');
		this.__eqitems[13].innerHTML = this.__makeSample(s_chemistry,'Chemistry');
			
		this.__samples  = e._$getByClassName(this.__body, 'j-sample');
		u._$forEach(this.__samples, function(_item, _index){
			v._$addEvent(_item, 'mouseover',this.__sampleHandle._$bind(this,true,_item));
			v._$addEvent(_item, 'mouseout', this.__sampleHandle._$bind(this,false,_item));
			v._$addEvent(_item, 'click', this.__sampleClick._$bind(this,_item));
		}._$bind(this));
		
		v._$addEvent(this.__latexSrc, 'keyup', function(){
			this.__latexMsg.innerHTML = this.__latexSrc.value.length + " 字符";
		}._$bind(this));
	}
	
	/**
	 * 点击选中
	 */
	__proMathEditUI.__onAreaClick = function(_item){
		this.__insertAtCaret(this.__latexSrc, _item.title);
		//this.__getMathimage();
	}
	
	/**
	 * 公式的显示与否
	 */
	__proMathEditUI.__showHideHandle = function(_bool,_index){
		if(!!_bool){
			e._$addClassName(e._$getChildren(this.__items[_index])[0], 'selected');
			this.__eqitems[_index].style.display = 'block';
		}else{
			e._$delClassName(e._$getChildren(this.__items[_index])[0], 'selected');
			this.__eqitems[_index].style.display = 'none';
		}
	}
	
	/**
	 * smaple公式的显示与否
	 */
	__proMathEditUI.__showsampleHandle = function(_bool,_index){
		if(!!_bool){
			e._$addClassName(this.__sampleitems[_index], 'selected');
			this.__sunSamples[_index].style.display = 'block';
		}else{
			e._$delClassName(this.__sampleitems[_index], 'selected');
			this.__sunSamples[_index].style.display = 'none';
		}
	}
	
	/**
	 * 点击Sample
	 */
	__proMathEditUI.__sampleClick = function(_item){
		var _name = e._$attr(_item, 'name');
		var _index = e._$attr(_item, 'index');
		
		var s='';
		if (_name=='Algebra') s=s_algebra[_index];
		else if (_name=='Calculus') s=s_calculus[_index];
		else if (_name=='Stats') s=s_stats[_index];
		else if (_name=='Set') s=s_set[_index];
		else if (_name=='Trig') s=s_trig[_index];
		else if (_name=='Physics') s=s_physics[_index];
		else if (_name=='Matrices') s=s_matrices[_index];
		else if (_name=='Chemistry') s=s_chemistry[_index];
		
		this.__insertAtCaret(this.__latexSrc, s);
		//this.__getMathimage();
	}
	
	/**
	 * Smaple公式的显示与否
	 */
	__proMathEditUI.__sampleHandle = function(_bool,_item){
		if(!!_bool){
			_item.style.border = "1px solid #49AF4F";
		}else{
			_item.style.border = "1px solid #ddd";
		}
	}
	
	/**
	 * 公式插入方法
	 */
	__proMathEditUI.__insertAtCaret = function(d, g) {
		if (document.selection) {
			d.focus();
			var e = document.selection.createRange();
			var h,b,a,f;
			e.text = g;
			d.focus()
		} else {
			if (d.selectionStart || d.selectionStart === 0) {
				if (d.value) {
					g = " " + g + " "
				} else {
					g = g + " "
				}
				h = d.value.length;
				b = d.selectionStart;
				a = d.selectionEnd;
				f = d.scrollTop;
				d.value = d.value.substring(0, b) + g + d.value.substring(a, d.value.length);
				d.focus();
				d.selectionStart = b + g.length;
				d.selectionEnd = b + g.length;
				d.scrollTop = f;
			} else {
				if (d.value) {
					g = " " + g;
				}
				h = d.value.length;
				d.value += g;
				d.focus();
			}
		}
	};
	
	/**
	 * 调用服务器服务 生成图片函数
	 */
	__proMathEditUI.__getMathimage = function(){
		if (!this.__latexSrc.value) {
			this.__latexMsg.innerHTML = "";
			this.__clearMathimage();
			return;
		}
		
		var _back = "bg,s," + "FFFFFF" + "80";
		var _backe = "&chf=" + encodeURIComponent(_back) + "&chco=" + "000000";
		
		if (this.__latexSrc.value.length > 200) {
			this.__latexMsg.innerHTML = "公式长度已经超过200个字符";
			e._$addClassName(this.__latexMsg, 'warninfo');
			this.__latexImg.src = "";
			_domUtil._$hiddenNode(this.__latexImg);
			this._$dispatchEvent('onGetImgSrc', this.__latexImg.src);
		} else {
			this.__latexMsg.innerHTML = this.__latexSrc.value.length + " 字符";
			e._$delClassName(this.__latexMsg, 'warninfo');
			/**
			 * jsonp返回 进行测试
			 */
			window.resultShow = this.__resultShow();
			var _url = "http://capture.srv.icourse163.org/image/latex.do?latex=" + encodeURIComponent(this.__latexSrc.value)+"&size=18&callback=resultShow";
			this.__addScriptTag(_url);
			
			/**
			 * google服务
			 */
			//this.__latexImg.src = "http://chart.apis.google.com/chart?cht=tx&chl=" + encodeURIComponent(this.__latexSrc.value) + _backe;
			//this._$dispatchEvent('onGetImgSrc', this.__latexImg.src);
		}
	}
	
	/**
	 * jsonp 返回数据
	 *
	 */
	__proMathEditUI.__addScriptTag = function(src){
		var script = document.createElement('script');
		script.setAttribute("type","text/javascript");
		script.src = src;
		document.body.appendChild(script);
	}
	
	__proMathEditUI.__resultShow = function(){
		var _that = this;
		return function(_data){
			_that.__latexImg.src = _data.url;
			_domUtil._$showNode(_that.__latexImg);
			_that._$dispatchEvent('onGetImgSrc', _that.__latexImg.src);
		}
	}
	
	/**
	 * 清除公式编辑内容
	 */
	__proMathEditUI.__clearMathimage = function(){
		this.__latexImg.src = "";
		this.__latexSrc.value = "";
	}
	
	/**
	 * 编码
	 */
	__proMathEditUI.__htmlEntityEncode = function(_str){
		/*_str = _str.replace(/&/gi, "&amp;");
		_str = _str.replace(/>/gi, "&gt;");
		_str = _str.replace(/</gi, "&lt;");
		_str = _str.replace(/\"/gi, "&quot;");
		_str = _str.replace(/\'/gi, "&#039;");*/
		return _str;
	}
	
	/**
	 * 生成map
	 */
	__proMathEditUI.__makeImgTable = function(_parent, arr, arr2, name){
		var img = document.createElement("img");
		//e._$attr(img, 'src', './img/'+name+'.png');
		e._$attr(img, 'src', m_normal_img[name]);
		e._$attr(img, 'usemap', "#map_"+name);

		var map = document.createElement("map");
		e._$attr(map, 'name', 'map_'+name);

		for (var i = 0 ; i < arr2.length ; i++) {
			var myarea= document.createElement("area");
			e._$attr(myarea, 'shape', 'rect');
			e._$attr(myarea, 'title', this.__htmlEntityEncode(arr[i]));
			e._$attr(myarea, 'coords', arr2[i]);
			
			myarea.onclick = this.__onAreaClick._$bind(this, myarea);
			map.appendChild(myarea);
		}
		_parent.appendChild(img);
		_parent.appendChild(map);
	}
	
	/**
	 * 复杂公式
	 */
	__proMathEditUI.__makeSample = function(arr,name){
		var s= "";
		for (var i = 0 ; i < arr.length ; i++) {
			//s+='<div class="f-fl j-sample samright" name="'+name+'" index="'+i+'"><span class="verticalAlign"></span><img src="img/'+name.toLowerCase()+'_'+(i+1)+'.png"></div>';
			var _nameIndex = name+'_'+(i+1);
			s+='<div class="f-fl j-sample samright" name="'+name+'" index="'+i+'"><span class="verticalAlign"></span><img src="'+m_normal_img[_nameIndex]+'"></div>';
		}
		return s;
	}
	
	return p._$$MathEditUI;
});


