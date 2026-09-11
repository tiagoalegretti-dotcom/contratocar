import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:pt-20">
        <p className="mb-3 text-sm font-medium text-violet-700">
          Compra e venda de veículos
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Contrato de compra e venda{" "}
          <span className="text-violet-600">de veículo</span>
        </h1>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contrato"
            className="rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700"
          >
            Começar
          </Link>
          <a
            href="#como-funciona"
            className="rounded-full px-6 py-3 text-sm font-medium text-zinc-700"
          >
            Como funciona
          </a>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">Como funciona</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Preencha", "Só o essencial: partes, veículo e valor."],
            ["2", "Confira", "O contrato aparece ao lado, conforme você preenche."],
            ["3", "Assine e baixe", "Pague, assine pelo site e baixe o arquivo."],
          ].map(([n, t, d]) => (
            <li
              key={n}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
            >
              <div className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-violet-600 text-sm text-white">
                {n}
              </div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-zinc-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="beneficios" className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">O que você ganha</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <h3 className="font-semibold">Assine pelo site agora</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Comprador e vendedor assinam no celular, pelo ContratoCar. Não precisa
              imprimir para começar a assinar.
            </p>
          </li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h3 className="font-semibold">Contrato com os seus dados</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Placa, chassi, preço, débitos e defeitos entram no texto na hora.
            </p>
          </li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h3 className="font-semibold">Edite depois de pagar</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Errou um dado? Ajuste o texto no site e baixe de novo.
            </p>
          </li>
        </ul>
      </section>

      <section id="ferramentas" className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="mb-2 text-center text-2xl font-semibold">Ferramentas grátis</h2>
        <p className="mb-8 text-center text-sm text-zinc-600">
          Sem cadastro. Use e imprima quando quiser.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li>
            <Link
              href="/recibo"
              className="block h-full rounded-2xl border border-zinc-200 bg-white p-5 hover:border-violet-300"
            >
              <p className="text-xs font-medium text-violet-700">Grátis</p>
              <h3 className="mt-1 font-semibold">Recibo de venda de veículo</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Preencha vendedor, comprador, placa e valor. Imprima na hora.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/calculadora-ipva"
              className="block h-full rounded-2xl border border-zinc-200 bg-white p-5 hover:border-violet-300"
            >
              <p className="text-xs font-medium text-violet-700">Grátis</p>
              <h3 className="mt-1 font-semibold">Calculadora de IPVA proporcional</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Veja quanto do IPVA do ano ainda resta no mês da venda, com opção de multas.
              </p>
            </Link>
          </li>
        </ul>
      </section>

      <section className="bg-zinc-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-violet-300">Carro, moto ou caminhão</p>
          <p className="mt-2 text-3xl font-semibold">Contrato com os seus dados</p>
          <p className="mt-2 text-sm text-zinc-400">
            Inclui transferência no DETRAN, débitos, defeitos e foro. Depois de
            pronto, as partes assinam pelo site.
          </p>
          <Link
            href="/contrato"
            className="mt-6 inline-block rounded-full bg-violet-500 px-6 py-3 text-sm font-medium hover:bg-violet-400"
          >
            Gerar contrato
          </Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="mb-6 text-center text-2xl font-semibold">Dúvidas</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold">Substitui a transferência no DETRAN?</dt>
            <dd className="mt-1 text-zinc-600">
              Não. O contrato registra a venda. A transferência no DETRAN continua
              obrigatória, em geral em até 30 dias.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Tem validade jurídica?</dt>
            <dd className="mt-1 text-zinc-600">
              Sim. É um contrato particular, com base no Código Civil e no CTB.
              A assinatura no site segue a MP 2.200-2/2001.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Dá para assinar pelo site?</dt>
            <dd className="mt-1 text-zinc-600">
              Sim. Depois do pagamento, comprador e vendedor assinam pelo celular,
              no próprio ContratoCar.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
