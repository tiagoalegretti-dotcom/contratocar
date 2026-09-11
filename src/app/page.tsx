import Link from "next/link";
import { siteUrl } from "@/lib/site";

const faq = [
  {
    q: "Como fazer um contrato de compra e venda de carro?",
    a: "Reúna os dados das partes e do veículo (placa, chassi, RENAVAM, preço). No ContratoCar você preenche, completa depois do pagamento, assina pelo celular e baixa o arquivo. A transferência de propriedade é outro passo, feito no app do governo.",
  },
  {
    q: "Preciso de contrato para transferir o veículo?",
    a: "A transferência e a comunicação de venda saem no app do gov.br (Carteira Digital de Trânsito), com ATPV-e. O contrato particular não substitui isso. Ele registra o negócio: preço, débitos, entrega e quem paga o quê, se houver briga depois.",
  },
  {
    q: "Recibo de venda substitui o contrato?",
    a: "Não. O recibo prova que o dinheiro foi pago. O contrato descreve o veículo, as obrigações e a multa se alguém desistir. Use os dois se quiser: recibo grátis aqui no site e contrato completo no gerador.",
  },
  {
    q: "Qual o prazo para transferir o veículo depois da venda?",
    a: "Pelo Código de Trânsito, o comprador em geral tem 30 dias. O vendedor deve comunicar a venda no app do governo para não continuar responsável por multa e IPVA.",
  },
  {
    q: "O contrato vale sem cartório?",
    a: "Sim, contrato particular tem força entre as partes. Reconhecimento de firma é opcional e pode ajudar em alguns órgãos. A assinatura no site segue a MP 2.200-2/2001. Isso não substitui um advogado em casos complexos.",
  },
  {
    q: "Dá para gerar contrato de moto ou caminhão?",
    a: "Sim. O mesmo fluxo serve para carro, moto e caminhão. O texto muda o tipo do veículo.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "ContratoCar",
        url: siteUrl(),
        inLanguage: "pt-BR",
        description:
          "Contrato de compra e venda de veículo online, com recibo e calculadora de IPVA.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:pt-20">
        <p className="mb-3 text-sm font-medium text-violet-700">
          Compra e venda de carro, moto ou caminhão
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Contrato de compra e venda{" "}
          <span className="text-violet-600">de veículo</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-zinc-600 sm:text-lg">
          Nunca foi tão fácil e rápido assinar o contrato de compra ou venda de
          um veículo.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contrato"
            className="inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700 sm:w-auto"
          >
            Gerar contrato
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
            [
              "1",
              "Comece o rascunho",
              "Monte o contrato: veículo, partes, preço, pagamento e situação. Chassi, RENAVAM e endereço ficam para depois, se não tiver em mãos.",
            ],
            [
              "2",
              "Confira o texto",
              "A prévia do contrato acompanha o que você informa, sem copiar o documento até pagar.",
            ],
            [
              "3",
              "Pague, assine e baixe",
              "PIX ou cartão. Comprador e vendedor assinam pelo site e baixam o arquivo.",
            ],
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

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-center text-2xl font-semibold">
          O que a pessoa busca depois de vender ou comprar o carro
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-600">
          Quase sempre não é “modelo jurídico”. É: o negócio fechou, o dinheiro
          vai sair ou já saiu, e falta um papel que descreva o carro e proteja
          as duas partes.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          <li className="rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-semibold">Contrato de compra e venda</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Quem vendeu, quem comprou, placa, chassi, preço, se tem
              financiamento, débitos e como será o pagamento.
            </p>
          </li>
          <li className="rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-semibold">Transferência no app do gov</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Comunicação de venda e ATPV-e saem na Carteira Digital de Trânsito.
              O contrato não faz essa etapa, mas deixa claro o acordo entre as
              partes.
            </p>
          </li>
          <li className="rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-semibold">Recibo do valor pago</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Comprovante simples do dinheiro. Tem gerador grátis no site, sem
              cadastro.
            </p>
          </li>
          <li className="rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-semibold">IPVA e multas na venda</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Quanto do IPVA do ano ainda resta e se há multa. A calculadora
              grátis ajuda a acertar no contrato.
            </p>
          </li>
        </ul>
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
            Inclui preço, débitos, defeitos, garantia e foro. Depois de pronto,
            as partes assinam pelo site.
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
        <dl className="space-y-6 text-sm">
          {faq.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold">{item.q}</dt>
              <dd className="mt-1 text-zinc-600">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
