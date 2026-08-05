# Respostas

## 1. Você tem um recurso finito - por exemplo, 100 conexões, 100 tokens ou 100 slots - e existe constantemente mais demanda do que oferta. Como você começa a pensar a solução?

Primeiro, eu analisaria o comportamento do sistema para entender se o problema está relacionado à falta de recursos ou a algum gargalo de performance.

Eu verificaria métricas como tempo de resposta, consumo de CPU, memória, quantidade de requisições, tempo médio de utilização dos recursos e comportamento dos usuários.

Caso exista algum processamento pesado ou uso ineficiente dos recursos, buscaria otimizações antes de simplesmente aumentar a infraestrutura.

Se a demanda for realmente superior à capacidade disponível, avaliaria estratégias como:

- implementação de filas de espera;
- controle de limite por usuário (rate limit ou quotas);
- priorização de solicitações;
- escalabilidade horizontal ou vertical;
- aumento da capacidade do pool de recursos.

O objetivo é garantir que os recursos sejam utilizados de forma eficiente, evitando indisponibilidade e mantendo previsibilidade no comportamento do sistema.

---

## 2. Dois clientes pedem o último slot disponível ao mesmo tempo. Como você garante que apenas um deles recebe o recurso?

Esse é um problema de concorrência, onde duas requisições podem tentar acessar o mesmo recurso simultaneamente.

Para evitar que o mesmo recurso seja entregue para dois clientes diferentes, eu garantiria que a operação de verificação e reserva seja atômica.

Algumas abordagens possíveis:

- utilizar transações com controle de concorrência no banco de dados;
- utilizar locks distribuídos;
- utilizar mecanismos atômicos de ferramentas como Redis;
- garantir que a atualização do estado do recurso aconteça em uma única operação.

Por exemplo, em vez de fazer:

- verificar se existe recurso disponível;
- depois reservar;

eu faria uma operação única que verifica e já realiza a reserva, evitando condições de corrida (*race conditions*).

---

## 3. O recurso pode ser devolvido pelo cliente ou expirar sozinho depois de determinado período. Isso muda sua arquitetura? Explique.

Sim, porque agora existe um ciclo de vida do recurso que precisa ser gerenciado.

Além do controle de disponibilidade, seria necessário armazenar informações como:

- quem está utilizando o recurso;
- quando ele foi adquirido;
- tempo máximo de utilização;
- status atual do recurso;
- momento da liberação.

Eu implementaria mecanismos para:

- liberar recursos manualmente quando o cliente finalizar o uso;
- expirar automaticamente recursos abandonados;
- executar processos periódicos para identificar recursos vencidos.

Também consideraria cenários de falha, por exemplo, quando o cliente desconecta sem liberar o recurso. Nesse caso, a expiração automática garante que o recurso volte para o pool.

---

## 4. Se o serviço que controla o pool cair no meio da operação, o que acontece com os recursos que já foram emprestados?

Depende da arquitetura utilizada.

Se o controle do pool estiver apenas dentro da memória da aplicação, uma falha pode causar perda do estado dos recursos, fazendo o sistema não saber quais recursos estavam em uso.

Para evitar esse problema, eu manteria o gerenciamento do pool desacoplado da aplicação, utilizando uma camada centralizada de controle, como Redis ou banco de dados.

Assim, mesmo que uma instância da aplicação falhe, o estado dos recursos permanece armazenado.

Além disso, aplicaria mecanismos como:

- expiração automática dos recursos;
- recuperação após falha;
- monitoramento de saúde do serviço;
- logs e auditoria das reservas.

O objetivo é garantir consistência e evitar que recursos fiquem presos indefinidamente.

---

## 5. Se uma segunda instância da aplicação for adicionada atrás de um load balancer, como garantir que o limite global de 100 recursos continue sendo respeitado?

O controle dos recursos não pode ficar dentro da memória local de cada instância da aplicação.

Se cada instância tivesse seu próprio contador, poderíamos ter um cenário como:

- Instância A acredita que possui 100 recursos;
- Instância B acredita que possui 100 recursos;

resultando em um limite global ultrapassado.

Para resolver isso, utilizaria um controle centralizado de estado, como:

- Redis;
- banco de dados relacional com transações;
- serviço dedicado de gerenciamento de recursos.

Todas as instâncias consultariam e atualizariam a mesma fonte de verdade.

Dessa forma, mesmo com várias instâncias atrás de um load balancer, o limite global de 100 recursos continua sendo respeitado.

---

## 6. Não há recurso disponível agora, mas um está prestes a ser devolvido. O cliente recebe erro imediato ou espera? Quais fatores influenciam essa decisão?

Depende da regra de negócio e da experiência esperada pelo usuário.

Algumas aplicações podem retornar erro imediatamente, enquanto outras podem colocar a solicitação em uma fila de espera.

Os principais fatores que influenciam essa decisão são:

- tempo máximo aceitável de espera pelo cliente;
- tempo médio de utilização dos recursos;
- criticidade da operação;
- quantidade esperada de usuários simultâneos;
- capacidade de processamento do sistema.

Uma abordagem comum é utilizar uma fila com timeout configurável. Caso o recurso seja liberado dentro desse período, a solicitação é atendida; caso contrário, o sistema retorna uma resposta informando indisponibilidade.

Em cenários de alta demanda previsível, também pode ser utilizada escalabilidade automática para aumentar a capacidade conforme a necessidade.
