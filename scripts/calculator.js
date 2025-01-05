/**
 * @classdesc classe usada para representa o objeto da calculadora e fazer o seu controle e funcionalidades.
 */
export default class Calculator
{
    constructor()
    {
        this.operation = { parcels: [], operator: "", result: "" };
        this.screen_element = document.querySelector("#screen");
        this.screen_need_clear = false;

        this.buttons = {
            clear: document.querySelector(".btn-clear"),
            result: document.querySelector(".btn-result"),
            delete: document.querySelector(".btn-delete"),
            invert: document.querySelector(".btn-invert"),
            numeric: document.querySelectorAll(".btn-number"),
            operators: document.querySelectorAll(".btn-operator"),
        };
    }

    /**
     * @description Limpa a tela e reseta a operação atual.
     */
    clearScreen()
    {
        this.screen_element.children[0].textContent = "0";
        this.screen_element.children[1].textContent = "";
        this.operation.operator = "";
        this.operation.parcels = [];
        this.operation.result = "";
        this.textSizeControl();
    }

    /**
     * @description Apaga o ultimo valor digitado em tela.
     */
    deleteLastValue()
    {
        const main_screen = this.screen_element.children[1];

        if (this.operation.result !== "") //Limpando a tela caso a operação esteja completa.
            this.clearScreen();

        if (main_screen.textContent)
        {
            let text_string = main_screen.textContent.split("");
            text_string.pop();

            main_screen.textContent = text_string.toString().replaceAll(",", "");
            this.textSizeControl();
        }
    }

    /**
     * @description Faz o controle do tamanho da fonte de acordo com a quantidade de valores em tela, além da verificação se um novo pode ser inserido.
     * @returns {Boolean}
     */
    textSizeControl()
    {
        const label_screen = this.screen_element.children[0];
        const main_screen = this.screen_element.children[1];

        //Fazendo o controle da fonte da tela de operação.
        label_screen.style.fontSize = (label_screen.textContent.length >= 30) ? "7pt" : "10pt";
        
        //Fazendo o controle da fonte da tela principal.
        let font_size = "20pt";
        
        if (main_screen.textContent.length > 13) font_size = "16pt";
        if (main_screen.textContent.length > 17) font_size = "11pt";
        
        main_screen.style.fontSize = font_size;

        //Verificando se o limite de 16 valores foi ultrapassado.
        return (main_screen.textContent.length <= 16);
    }

    /**
     * @description Essa função escreve um determinado valor em tela, além de fazer validações nesse valor.
     * @param {String} value_text string que será escrito na tela.
     * @returns {void}
     */
    writeOnScreen(value_text)
    {
        const main_screen = this.screen_element.children[1];

        //Encerrando o metódo caso o valor digitado seja o ponto.
        if (value_text === ".")
            if (main_screen.textContent === "" || main_screen.textContent.split(".").length > 1)
                return;

        //Caso a opração atual já tenha um resultado significa que ela terminou e pode ser limpa para uma nova ser iniciada.
        if (this.operation.result !== "")
            this.clearScreen();

        //Verficando se o valor atual na tela deve ser limpo ou não.
        if ((main_screen.textContent === "0" && value_text !== ".") || this.screen_need_clear)
            main_screen.textContent = "";

        if (this.textSizeControl())
        {
            this.screen_need_clear = false;
            main_screen.textContent += value_text;
        }
    }

    /**
     * @description Exibe em tela todos os valores da operação atual.
     */
    writeOperationOnScreen()
    {
        const label_screen = this.screen_element.children[0];
        const main_screen = this.screen_element.children[1];

        if (this.operation.parcels[0])
            label_screen.textContent = `${this.operation.parcels[0]} ${this.operation.operator}`;

        if (this.operation.parcels[1])
        {
            label_screen.textContent += ` ${this.operation.parcels[1]} = `;
            main_screen.textContent = String(this.operation.result);
            this.textSizeControl();
        }
    }

    /**
     * @description Inverte o valor atual que esta na tela.
     */
    invertValue()
    {
        const main_screen = this.screen_element.children[1];
        if (main_screen.textContent)
            main_screen.textContent = String(-Number(main_screen.textContent));
    }

    /**
     * @description Realiza uma operação matemática de acordo com o operador passado e os valores numéricos.
     * @param {Number} parcel_one parcela da esquerda.
     * @param {Number} parcel_two parcela da direita.
     * @param {String} operator operador matemático.
     * @returns {String}
     */
    realizeCalc(parcel_one, parcel_two, operator)
    {
        if (operator === "/" && parcel_two === 0)
            return "Não é possivel dividir por zero.";

        if (["+", "-", "x", "/"].indexOf(operator) !== -1) //Validando se o operador passado é um dos operadores validos.
        {
            switch (operator)
            {
                case "+": return parcel_one + parcel_two;
                case "-": return parcel_one - parcel_two;
                case "x": return parcel_one * parcel_two;
                case "/": return parcel_one / parcel_two;
                default: return "";
            }
        }
        return "";
    }

    /**
     * @description Finaliza a operação atual setando o valor da segunda parcela e calculando o seu respectivo resultado.
     */
    operationGetResult()
    {
        const main_screen = this.screen_element.children[1];
        if (this.operation.parcels[0])
        {
            this.operation.parcels[1] = Number(main_screen.textContent);
            this.operation.result = this.realizeCalc(...this.operation.parcels, this.operation.operator);
        }
        this.writeOperationOnScreen();
    }

    /**
     * @constructor Da inicio ao uma nova operação obtendo o valor da primeira parcela e seu operador. Tambem deixa informado que a tela precisa ser limpa quando o próximo valor for digitado.
     * @param {String} operator string contendo o operador que será usado.
     */
    operationGetOperator(operator)
    {
        const main_screen = this.screen_element.children[1];
        if (main_screen.textContent)
        {
            this.operation.parcels[0] = Number(main_screen.textContent);
            this.operation.parcels[1] = undefined;
            this.operation.operator = operator;
            this.operation.result = "";
            this.screen_need_clear = true;
        }
        this.writeOperationOnScreen();
    }

    /**
     * @description Faz o carregamento de todos os eventos necessário para ultilizar a calculadora.
     */
    loadEvents()
    {
        //Carregando os eventos em todos os botôes numéricos.
        this.buttons.numeric.forEach(button => {
            button.addEventListener("click", ({ target }) => this.writeOnScreen(target.textContent));
        });
        //Carregando o evento de cada botão de operador.
        this.buttons.operators.forEach(button => {
            button.addEventListener("click", ({ target }) => { this.operationGetOperator(target.textContent); });
        });
        //Carregando evento de resolução de operação.
        this.buttons.result.addEventListener("click", ({ target }) => { this.operationGetResult(target.textContent); });

        this.buttons.clear.addEventListener("click", () => this.clearScreen());
        this.buttons.invert.addEventListener("click", () => this.invertValue());
        this.buttons.delete.addEventListener("click", () => this.deleteLastValue());
    }
}