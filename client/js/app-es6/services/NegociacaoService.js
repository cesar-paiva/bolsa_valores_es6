class NegociacaoService {

    constructor() {
        this._httpService = new HttpService();
    }

    obterNegociacoes() {
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {
            let negociacoes = periodos.reduce((dados, periodo) => dados.concat(periodo), []);
            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    obterNegociacoesDaSemana() {
        return this._httpService.get('negociacoes/semana')
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Erro ao consultar as negociações da semana');
            });
    }

    obterNegociacoesDaSemanaAnterior() {
        return this._httpService.get('negociacoes/anterior')
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Erro ao consultar as negociações da semana anterior');
            });
    }

    obterNegociacoesDaSemanaRetrasada() {
        return this._httpService.get('negociacoes/retrasada')
            .then(negociacoes => {
                return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(erro => {
                console.log(erro);
                throw new Error('Erro ao consultar as negociações da semana retrasada');
            });
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso')
            .catch(() => {
                console.log(erro)
                throw new Error('Negociação adicionada com sucesso')
            });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(() => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações')
            });
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                console.log(erro)
                throw new Error('Não foi possível obter as negociações')
            });
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
            .then(negociacoes => negociacoes.filter(negociacao =>
                !listaAtual.some(negociacaoExistente =>
                    negociacao.isEquals(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro)
                throw new Error('Não foi possível obter as negociações para importar')
            });
    }
}