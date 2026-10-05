import * as FileSystem from 'expo-file-system/legacy';

/*
 * Armazenamento das tarefas no próprio celular (arquivo JSON).
 * Usa o mesmo formato das tarefas do back, então as telas funcionam igual.
 */

export type TarefaLocal = {
    id: string;
    titulo: string;
    descricao: string | null;
    prazoInic: string | null;
    prazoFim: string | null;
    prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
    status: 'EM_ANDAMENTO' | 'CONCLUIDA' | 'EM_ATRASO';
    dicas: string | null;
    deletadoEm: string | null;
    arquivadoEm: string | null;
};

export type NovaTarefaLocal = {
    titulo: string;
    descricao?: string | null;
    prioridade?: TarefaLocal['prioridade'];
    status?: TarefaLocal['status'];
    prazoInic?: string | null;
    prazoFim?: string | null;
    dicas?: string | null;
};

export type AtualizacaoTarefaLocal = Partial<NovaTarefaLocal>;

const ARQUIVO = `${FileSystem.documentDirectory ?? ''}tarefas.json`;
const DIAS_NA_LIXEIRA = 7;

// Leituras e gravações acontecem uma de cada vez para não se sobrescreverem.
let fila: Promise<unknown> = Promise.resolve();

function emSequencia<T>(operacao: () => Promise<T>): Promise<T> {
    const resultado = fila.then(operacao);
    fila = resultado.catch(() => undefined);
    return resultado;
}

async function lerTodas(): Promise<TarefaLocal[]> {
    const info = await FileSystem.getInfoAsync(ARQUIVO);

    if (!info.exists) {
        return [];
    }

    const dados = JSON.parse(await FileSystem.readAsStringAsync(ARQUIVO));

    if (!Array.isArray(dados)) {
        return [];
    }

    // Igual à limpeza da lixeira do back: some o que está lá há mais de 7 dias.
    const limite = Date.now() - DIAS_NA_LIXEIRA * 24 * 60 * 60 * 1000;

    return (dados as TarefaLocal[]).filter(
        (tarefa) =>
            !tarefa.deletadoEm || new Date(tarefa.deletadoEm).getTime() > limite
    );
}

async function gravarTodas(tarefas: TarefaLocal[]) {
    await FileSystem.writeAsStringAsync(ARQUIVO, JSON.stringify(tarefas));
}

function gerarId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function porDataDesc(campo: 'arquivadoEm' | 'deletadoEm') {
    return (a: TarefaLocal, b: TarefaLocal) =>
        new Date(b[campo] ?? 0).getTime() - new Date(a[campo] ?? 0).getTime();
}

export function listarTarefasLocais(): Promise<TarefaLocal[]> {
    return emSequencia(async () => {
        const tarefas = await lerTodas();

        // Mesma ordem do back: prazo mais próximo primeiro, sem prazo por último.
        return tarefas
            .filter((t) => !t.deletadoEm && !t.arquivadoEm)
            .sort(
                (a, b) =>
                    (a.prazoFim ? new Date(a.prazoFim).getTime() : Infinity) -
                    (b.prazoFim ? new Date(b.prazoFim).getTime() : Infinity)
            );
    });
}

export function listarArquivadasLocais(): Promise<TarefaLocal[]> {
    return emSequencia(async () =>
        (await lerTodas())
            .filter((t) => !t.deletadoEm && t.arquivadoEm)
            .sort(porDataDesc('arquivadoEm'))
    );
}

export function listarExcluidasLocais(): Promise<TarefaLocal[]> {
    return emSequencia(async () =>
        (await lerTodas())
            .filter((t) => t.deletadoEm)
            .sort(porDataDesc('deletadoEm'))
    );
}

export function criarTarefaLocal(dados: NovaTarefaLocal): Promise<TarefaLocal> {
    return emSequencia(async () => {
        const tarefas = await lerTodas();

        const nova: TarefaLocal = {
            id: gerarId(),
            titulo: dados.titulo,
            descricao: dados.descricao ?? null,
            prazoInic: dados.prazoInic ?? null,
            prazoFim: dados.prazoFim ?? null,
            prioridade: dados.prioridade ?? 'MEDIA',
            status: dados.status ?? 'EM_ANDAMENTO',
            dicas: dados.dicas ?? null,
            deletadoEm: null,
            arquivadoEm: null,
        };

        await gravarTodas([...tarefas, nova]);
        return nova;
    });
}

async function alterar(
    id: string,
    pode: (tarefa: TarefaLocal) => boolean,
    mudar: (tarefa: TarefaLocal) => TarefaLocal,
    erro: string
) {
    const tarefas = await lerTodas();
    const indice = tarefas.findIndex((t) => t.id === id && pode(t));

    if (indice === -1) {
        throw new Error(erro);
    }

    tarefas[indice] = mudar(tarefas[indice]);
    await gravarTodas(tarefas);
}

export function atualizarTarefaLocal(
    id: string,
    dados: AtualizacaoTarefaLocal
): Promise<void> {
    return emSequencia(() =>
        alterar(
            id,
            (t) => !t.deletadoEm,
            (t) => {
                // undefined = não mexe; null = limpa o campo (igual ao back).
                const atualizada = { ...t };
                if (dados.titulo !== undefined) atualizada.titulo = dados.titulo;
                if (dados.descricao !== undefined) atualizada.descricao = dados.descricao;
                if (dados.prioridade !== undefined) atualizada.prioridade = dados.prioridade;
                if (dados.status !== undefined) atualizada.status = dados.status;
                if (dados.prazoInic !== undefined) atualizada.prazoInic = dados.prazoInic;
                if (dados.prazoFim !== undefined) atualizada.prazoFim = dados.prazoFim;
                if (dados.dicas !== undefined) atualizada.dicas = dados.dicas;
                return atualizada;
            },
            'Tarefa não encontrada ou na lixeira.'
        )
    );
}

export function arquivarTarefaLocal(id: string): Promise<void> {
    return emSequencia(() =>
        alterar(
            id,
            (t) => !t.deletadoEm && !t.arquivadoEm,
            (t) => ({ ...t, arquivadoEm: new Date().toISOString() }),
            'Tarefa não encontrada ou já arquivada.'
        )
    );
}

export function excluirTarefaLocal(id: string): Promise<void> {
    return emSequencia(() =>
        alterar(
            id,
            (t) => !t.deletadoEm,
            (t) => ({ ...t, deletadoEm: new Date().toISOString() }),
            'Tarefa não encontrada.'
        )
    );
}

export function restaurarTarefaLocal(id: string): Promise<void> {
    return emSequencia(() =>
        alterar(
            id,
            (t) => Boolean(t.deletadoEm || t.arquivadoEm),
            (t) => ({ ...t, deletadoEm: null, arquivadoEm: null }),
            'Tarefa não encontrada para restauração.'
        )
    );
}