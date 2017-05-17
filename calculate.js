/* 
 * 这是一个功能比较强大的计算机
 * 运算法 包括了 加减乘除以及括号
 * 整个过程是面向对象实现的
 */

/**
 * 这是一个计算机类
 * 在点击了"AC"之后，会触发clean(),把Input框里面的显示成0,另外把表达式this.express清空
 * 在点击了“del”之后，会触发deleteNumber（），把表达式的最后一位删除，并且显示在Input框里面
 * 在点击普通字符，既标签属性class=keyButton,就会触发showExpresson,会把你所输入的字符显示在input框里面，然后把表达式赋值this.expression += expression
 * 在点击“=”之后，就会调用calculateResult（）方法进行计算；计算大致分为6步
 * 1.验证是否有非法的运算符
 * 2.验证是否有非法的浮点
 * 3，验证括号使用是否正确
 * 4.去掉表达式中的括号
 * 5.去掉表达式中的乘法和除法
 * 6.现在的表达式里面只有加法和减法运算符，接下来，我们只要进行加减法运算既可以得到最后的答案了
 * @returns {Calculate}
 */
function Calculate() {
    this.showArea = document.getElementById("show");
    this.expression = '';
    this.clean = function() {
        this.showArea.value = '0';
        this.expression = '';
    };
    this.deleteNumber = function() {
        this.expression = this.expression.substring(0,this.expression.length-1);
        this.showArea.value = this.expression;
    };
    this.showExpression = function(expression) {
        this.expression += expression;
        this.showArea.value = this.expression;
    };
    /**
     * first step we should remove bracket
     * second step we should remove Multiplic and Division
     * the last step just remove plus and minus,and then result out
     * @returns {undefined}
     */
    this.calculateResult = function() {
//        this.expression = "1.1+(2.1*3)-(((2.2*3)*((1.1+2.2)/3.3)-3.4*6)-(3.5*6))+3.6";
        var wrongMessage = "this expression is invalid";
        if (!this.checkOperator(this.expression) || !this.checkFloat(this.expression)) {
            this.showArea.value = wrongMessage;
            this.expression = '';
            return ;
        }
        if(this.hasBracket(this.expression)) {
            if (!this.checkBracket(this.expression)) {
                this.showArea.value = wrongMessage;
                this.expression = '';
                return ;
            }
            this.expression = this.removeBracket(this.expression);
        }

        if(this.hasCaret(this.expression)) {
            this.expression = this.removeCaret(this.expression);
        }

        if(this.hasReagan(this.expression)) {
            this.expression = this.removeReagan(this.expression);
        }

        if (this.hasMultiplicOrDivision(this.expression)) {
            this.expression = this.removeMultiplicOrDivision(this.expression);
        }
        if(this.hasPlusOrMinus(this.expression)) {
            this.expression = this.plusOrMinus(this.expression);
        }
        this.showArea.value = this.expression;
        this.expression = '';
    };
    /**
     * 
     * @param {type} expression
     * @returns {undefined|Boolean}
     * 检查运算符是否合法,第一个字符是除“-”意外的运算符都是非法的，最后一个字符是运算符，也是非法的；
     * 检查是否含有不合法的多运算符 “**”，“*\/”,"*+"，"*-","+*","++","+\/"以及两以上的连续运算符都是不允许的
     * 在多运算符里面除了 “--”，“+-”都是不合法的多运算符
     */
    this.checkOperator = function(expression) {
        /**
         * (^[\+\*\/])|([\+\-\*\/\^\√]$) 匹配首字符或是最后一个字符是不是运算符
         * ([\+\-\*\/][\+\*\/]+) [+,*,-,/]搭配一个或是多个[+,*,/]
         * ([\*\/](\-)+) [*,/]搭配一个或是多个[-]
         * ([\+\-](\-){2,}) [+,-]搭配两个以上的[-]
         * (\√[^\d\(]+) 表示后面不能有除了数数字及括号意外的东西
         * ((?:[^\d\)]+)\^)
         * (\^[^\d\(]+)
         * ((?:[^\d\)]+)\^[^\d\(]+) 表示前面和后面不能有数字及括号意外的字符
         * ([\√\^]{2,}) 这个两个符号不可以连续
         * ([\√\^]\d+[\√\^]) √2^,^22√222这样也是不允许的
         * @type RegExp
         */
      var reg = /(^[\+\*\/])|([\+\-\*\/\^\√]$)|([\+\-\*\/][\+\*\/]+)|([\*\/](\-)+)|([\+\-](\-){2,})|((?:[^\d\+\-\*\/])\√)|(\√[^\d\(]+)|((?:[^\d\)]+)\^)|(\^[^\d\(]+)|([\√\^]{2,})|([\√\^]\d+[\√\^])/;
      if(reg.test(expression)) {
          return false;
      }
      return true;
    };
    /**
     * 
     * @param {type} expression
     * @returns {undefined}
     * 检查“.”是否在正确位置，".+","+.","^.",".$","2.2.3.4.5","..","..."都是不允许的。
     */
    this.checkFloat = function (expression) {
        /**
         * (^\.)|(\.$) expression以.开头或结尾
         * ([\+\-\*\/]\.)|(\.[\+\-\*\/]) expression出现".+","+."等情况
         * ((\d+\.+){2,}\d*) expression出现"2.2.3.4.5","..","..."等情况
         */
        var reg = /(^\.)|(\.$)|([\+\-\*\/\^\√]\.)|(\.[\+\-\*\/\^\√])|((\d+\.+){2,}\d*)/;
        if (reg.test(expression)) {
            return false;
        }
        return true;
    };
    /**
     * 
     * @param {type} expression
     * @returns {@this;@call;removeBracket}
     * make sure the expression has bracket
     */
    this.hasBracket = function(expression) {
        var hasBraketReg = /(\(|\))/; //查看表达expression中是否有（）；
        if (hasBraketReg.test(expression)) {
            return true;
        }
        return false;
    };
    /**
     * 检查表达式中的输入的括号输入正确；
     * 1.括号必须与运算符号连接在一起 既“3（”，“（*3”，“3*）”，“）3”,".)",".(","(.",").",是不允许的
     * 2.左括号的数量必须等于右括号的数量
     * @param {type} expression
     * @returns {undefined}
     */
    this.checkBracket = function(expression) {
        var reg = /([\d\.]\()|(\)[\d\.])|(\([\+\-\*\/\.])|([\+\-\*\/\.]\))/;
        if (reg.test(expression)) {
            return false;
        }
        var leftBracket = 0, rightBracket = 0;
        for (var i = 0; i < expression.length; i++) {
            if (expression.charAt(i) === "(") {
                leftBracket++;
            } else if(expression.charAt(i) === ")") {
                rightBracket++;
            }
        }
        if (!(leftBracket === rightBracket)) {
            return false;
        }
        return true;
    };
    /**
     * 
     * @param {type} expression
     * remove bracket;
     * @returns {undefined}
     */
    this.removeBracket = function(expression) {
        var regMatch = /\([^\(\)]+\)/g; //这个正则表达式匹配最里面的一层括号，既(这里面是不能包含“（”或是“）”的)
        var childExpression = expression.match(regMatch);
        var mySign = "&mySign&"; //用一个特殊标记记录等会需要替换的位置
        var replaceExpression = expression.replace(regMatch,mySign);
        var subExpression = "";
        for(var i = 0; i < childExpression.length; i++) {
            subExpression = childExpression[i].substring(1,childExpression[i].length-1);
            if (this.hasCaret(subExpression)) {
                subExpression = this.removeCaret(subExpression);
            }
            if (this.hasReagan(subExpression)) {
                subExpression = this.removeReagan(subExpression);
            }
            if (this.hasMultiplicOrDivision(subExpression)) {
                subExpression = this.removeMultiplicOrDivision(subExpression);
            }
            if (this.hasPlusOrMinus(subExpression)) {
                subExpression = this.plusOrMinus(subExpression);
            }
            replaceExpression = replaceExpression.replace(mySign,subExpression);
        }
        expression = replaceExpression;
        if(this.hasBracket(expression)) {
            expression = this.removeBracket(expression);
        } else {
            return expression;
        }
        return expression;
    };

    /**
     *
     * @param {type} expression
     * make sure the expression with Reagan Or Caret
     */
    this.hasCaret = function(expression) {
        var reg =  /\^/;
        if (reg.test(expression)) {
            return true;
        }
        return false;
    };

    this.removeCaret = function (expression) {
        // var expression = "2^2 3^1234";
        var regMatch = /(\d+\.?\d*)\^(\d+\.?\d*)/g;
        var childResult = "";
        var childExpression = expression.match(regMatch);
        var mySign = '&removeReagan&'; //用一个特殊标记记录等会需要替换的位置
        var replaceExpression = expression.replace(regMatch,mySign);
        for(var i = 0; i < childExpression.length; i++) {
            childResult = this.caret(childExpression[i]);
            replaceExpression = replaceExpression.replace(mySign,childResult);
        }
        expression = replaceExpression;
        return expression;
    };

    this.caret = function (expression) {
        var regNumber = /\d+\.?\d*/g;
        var arrNumbers = expression.match(regNumber);

        return Math.pow(parseFloat(arrNumbers[0]), parseFloat(arrNumbers[1]));
    };

    this.hasReagan = function(expression) {
        var reg =  /\√/;
        if (reg.test(expression)) {
            return true;
        }
        return false;
    };

    this.removeReagan = function (expression) {
        // var expression = "2√2 3√1234";
        var regMatch = /(\d+\.?\d*)*\√(\d+\.?\d*)/g;
        var childResult = "";
        var childExpression = expression.match(regMatch);
        var mySign = '&removeReagan&'; //用一个特殊标记记录等会需要替换的位置
        var replaceExpression = expression.replace(regMatch,mySign);
        for(var i = 0; i < childExpression.length; i++) {
            childResult = this.reagan(childExpression[i]);
            replaceExpression = replaceExpression.replace(mySign,childResult);
        }
        expression = replaceExpression;
        return expression;
    };

    this.reagan = function (expression) {
        var regNumber = /\d+\.?\d*/g;
        var arrNumbers = expression.match(regNumber);
        if (arrNumbers[1]) {
            return Math.pow(parseFloat(arrNumbers[1]), 1/parseFloat(arrNumbers[0]));
        }

        return Math.sqrt(parseFloat(arrNumbers[0]));
    };

    /**
     *
     * @param {type} expression
     * @returns {@this;@call;removeMultiplicOrDivision}
     * make sure the expression with Multiplic Or Division
     */
    this.hasMultiplicOrDivision = function(expression) {
        var hasMultiplicOrDivisionReg =  /(\*|\/)/;
        if (hasMultiplicOrDivisionReg.test(expression)) {
            return true;
        };
        return false;
    };

    /**
     * 
     * @param {type} expression
     * remove Multiplic and Division
     * @returns {unresolved}
     */
    this.removeMultiplicOrDivision = function(expression) {
//        var expression = "1-13*2+3*456/3*15*8/5*4-50-40+32*2/16"; //test data
        var regMatch = /((\d+\.?\d*)(\*|\/))+(\d+\.?\d*)/g;
        var childResult = "";
        var childExpression = expression.match(regMatch);
        var mySign = "&removeMultiplicOrDivision&"; //用一个特殊标记记录等会需要替换的位置
        var replaceExpression = expression.replace(regMatch,mySign);
        for(var i = 0; i < childExpression.length; i++) {
            childResult = this.multiplicOrDivision(childExpression[i]);
            replaceExpression = replaceExpression.replace(mySign,childResult);
        }
        expression = replaceExpression;
        return expression;
    };
    this.multiplicOrDivision = function(expression) {
        var regNumber = /\d+\.?\d*/g;
        var regOperator = /(\*|\/)/g;
        var arrNumbers = expression.match(regNumber);
        var arrOperators = expression.match(regOperator);
        
        var calResult = parseFloat(arrNumbers[0]);
        for (var i = 0; i < arrOperators.length; i++) {
            if (arrOperators[i] === '*') {
                calResult *= parseFloat(arrNumbers[i+1]);
            } else {
                calResult /= parseFloat(arrNumbers[i+1]);
            }
        }
        return calResult;
    };
    
    this.hasPlusOrMinus = function(expression) {
        var hasPlusOrMinusReg =  /(\+|\-)/;
        if (hasPlusOrMinusReg.test(expression)) {
            return true;
        };
        return false;
    };
    /**
     * 
     * @param {type} expression
     * this is the last step , just has plus or minus , after we done this step, the result out
     * @returns {Calculate.plusOrMinus.calResult}
     */
    this.plusOrMinus = function(expression) {
        /**
         *  如果第一个字符是“-”号,就在expression前面加上一个0即可
         */
        if (expression.charAt(0) === "-") {
            expression = 0 + expression;
        }
        var doubleMinusReg = /\-\-/;  //减去一个负数，等于加一个正数
        if (doubleMinusReg.test(expression)) {
            expression = expression.replace(doubleMinusReg,"+");
        }
        doubleMinusReg = /\+\-/;  //加上一负数，等于减去一个正数
        if (doubleMinusReg.test(expression)) {
            expression = expression.replace(doubleMinusReg,"-");
        }
        var regNumber = /\d+\.?\d*/g;
        var regOperator = /(\+|\-)/g;
        var arrNumbers = expression.match(regNumber);
        var arrOperators = expression.match(regOperator);
        
        var calResult = parseFloat(arrNumbers[0]);
        for (var i = 0; i < arrOperators.length; i++) {
            if (arrOperators[i] === '+') {
                calResult += parseFloat(arrNumbers[i+1]);
            } else {
                calResult -= parseFloat(arrNumbers[i+1]);
            }
        }
        return calResult;
    };
}

function pageLoad() {
    var calculate = new Calculate();
    var ACkeyButton = document.getElementsByClassName("ACkeyButton");
    ACkeyButton[0].onclick = function() { 
        calculate.clean();
    };
    var deleteNumber = document.getElementById("deleteNumber");
    deleteNumber.onclick = function() { 
        calculate.deleteNumber();
    };
    var calculateResult = document.getElementById("calculateResult");
    calculateResult.onclick = function () {
        calculate.calculateResult();
    };
    var keyButton = document.getElementsByClassName("keyButton");
    for (var i in keyButton) {
        /**
         *这个写法是错误的，因为i没有被lock住
         *在这个循环执行以后，点击keyButton的时候，i才获得具体的数值
         *因为点击的时候i才真正的获得数值
         */
//        keyButton[i].onclick = function() {
//            return calculate.showExpression(keyButton[i].innerHTML);
//        };
        //(function () { /* code */ } ()); // 推荐使用这个
        //(function () { /* code */ })(); // 但是这个也是可以用的
        /**
         * 下面两种写法都是可以的,因为它在自执行函数表达式闭包的内部
         * 因为闭包直接可以引用传入的这些参数，利用这些被lock住的传入参数，自执行函数表达式可以有效地保存状态。
         * i的值作为locked的索引存在，尽管循环执行以后，i的值变成了最后一个keybutton
         * 但闭包内部的lockedInIndex值是没有改变，因为他已经执行完毕了
         * 所以当点击连接的时候，结果是正确的
         */
        
//        (function(i){
//            keyButton[i].onclick = function() {
//            return calculate.showExpression(keyButton[i].innerHTML);
//            };
//        }(i));
        /**
         * 你也可以像下面这样应用，在处理函数那里使用自执行函数表达式
         * 但是相对来说，上面的代码更具可读性
         */
        keyButton[i].onclick = (function(index) {
            return function() {
                calculate.showExpression(keyButton[index].innerHTML);
            };
        })(i);
    }
};
