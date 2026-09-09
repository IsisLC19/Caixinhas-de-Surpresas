# App Caixinhas de Surpresas
## Contexto
Criar uma aplicação SPA com stack HTML, CSS, JS puro, sem pacotes ou dependências para hospedar no GitHub Page.
A aplicação será um cardápio de Festa na caixa com montagens prontas e personalizadas.

# Recursos do App
1. Carregar os dados do cardápio a partir de uma **estrutura jSon** om produtos organizados por **tamanho** (P, M, G) e **quantidade de itens internos**.
2. O aplicativo SPA irá carregar, já na primeira rtela, a lista de produtos. Não exige cadastro até o checkout.
3. O SPA deverá usar **localstorage** para armazenar os itens no carrinho 
4. Ao finalizar a compra no carrinho, o usuário então devera se cadastrar (nome, WhatsApp e endereço) e durante o cadastro adicionar localização (**geolocation**). Caso o usuário não permita a captura da sua localização encerre o  cadastro e não siga.
5.  Após o cadastro, pedir as credenciais do dispositivo (CredentialsContainer) como uma camada extra de segurança e prova de vida
6. Após validar as credenciais, simular um gateway de pagamento generico.
7. -   É possível: adicionar item, alterar quantidade e remover item.

## Carrinho
-   O pedido é "confirmado" com um **status simulado de pagamento aprovado** (sempre aprovado — não há aleatoriedade).
-   Na tela de confirmação são exibidos: resumo do pedido, total e um **botão "Enviar pedido no WhatsApp"** que abre um link `wa.me` com mensagem pré-formatada contendo itens, quantidades, total e nome do cliente.    
-   Após a confirmação, o carrinho é esvaziado.

## O que o aplicativo não deve fazer:
1. processar o pagamento. Será apenas uma simulação
2. Cadastrar produtos. Iremos carregar os dados de um arquivo Json fictício, gerado por IA
3. O aplicativo *NÃO controla delivery*


## JSON exemplo:
{
  "produtos": [
    {
      "id": "caixa-p-10",
      "nome": "Caixinha Clássica",
      "tamanho": "P",
      "quantidadeItens": 10,
      "itens": ["Brigadeiro", "Beijinho", "Bolo de 1 kilo"],
      "preco": 89.9,
      "imagem": "img/caixa-p.png",
      "descricao": "Montagem pronta com 10 doces variados."
    }
  ]
}

## UI/UX
1. Utilize a paleta de cores em tons de rosa
2. Utilize Google Fonts: "Poppins" para titulos e "Open Sans" para texto corrido. E aplique versões condensadas das fontes quando convenientes.
3. **Não use emojis**. Utilize Google Icons.
4. Interface minimalista, fundo branco.
5. Adicione pequenas animações em otões e transições de telas
