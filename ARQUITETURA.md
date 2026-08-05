# Arquitetura

## 1. Recurso finito com demanda maior que oferta

Quando há mais demanda do que oferta de um recurso finito — por exemplo, 100 conexões, 100 tokens ou 100 slots — a primeira etapa é entender se o problema está na falta de recurso ou em um gargalo de performance.

Eu verificaria métricas como:

- tempo de resposta
- consumo de CPU
- consumo de memória
- quantidade de requisições
- tempo médio de utilização dos recursos
- comportamento dos usuários

Se houver processamento pesado ou uso ineficiente dos recursos, otimizações são preferíveis antes de escalar a infraestrutura.

Se a demanda realmente exceder a capacidade, avaliaria estratégias como:

- implementação de filas de espera
- controle de limite por usuário (rate limit ou quotas)
- priorização de solicitações
- escalabilidade horizontal ou vertical
- aumento da capacidade do pool de recursos

O objetivo é usar os recursos de forma eficiente, evitando indisponibilidade e mantendo previsibilidade.

## 2. Dois clientes pedem o último slot ao mesmo tempo

Esse é um problema de concorrência: duas requisições podem tentar reservar o mesmo recurso simultaneamente.

Para garantir que apenas um cliente receba o recurso, a verificação e a reserva devem ser atômicas.

Abordagens possíveis:

- usar transações com controle de concorrência no banco de dados
- usar locks distribuídos
- usar mecanismos atômicos como Redis
- garantir que a atualização do estado ocorra em uma única operação

Em vez de:

1. verificar se há recurso disponível
2. reservar o recurso

faço uma operação única que verifica e reserva ao mesmo tempo, evitando race conditions.

## 3. Recurso devolvido ou expira sozinho

Esse cenário muda a arquitetura, pois o recurso passa a ter um ciclo de vida que precisa ser gerenciado.

Além do controle de disponibilidade, deve-se armazenar:

- quem está utilizando o recurso
- quando ele foi adquirido
- tempo máximo de utilização
- status atual do recurso
- momento da liberação

Mecanismos necessários:

- liberar recursos manualmente quando o cliente terminar o uso
- expirar automaticamente recursos abandonados
- executar processos periódicos para identificar recursos vencidos

Também é importante lidar com falhas, como cliente desconectando sem liberar o recurso. Nesse caso, a expiração automática devolve o recurso ao pool.

## 4. Serviço de controle do pool cai durante a operação

Se o controle do pool estiver apenas na memória da aplicação, uma falha pode fazer o sistema perder o estado dos recursos.

Para evitar isso, o gerenciamento do pool deve ser desacoplado da aplicação e mantido em uma camada centralizada, como Redis ou banco de dados.

Assim, mesmo que uma instância falhe, o estado dos recursos permanece disponível.

Também aplicaria:

- expiração automática dos recursos
- recuperação após falha
- monitoramento de saúde do serviço
- logs e auditoria das reservas

O objetivo é garantir consistência e evitar que recursos fiquem presos indefinidamente.

## 5. Segunda instância atrás de load balancer

O controle de recursos não pode ficar na memória local de cada instância.

Se cada instância mantiver seu próprio contador, teríamos:

- Instância A acredita ter 100 recursos
- Instância B acredita ter 100 recursos

resultando em limite global ultrapassado.

A solução é um controle centralizado de estado, como:

- Redis
- banco de dados relacional com transações
- serviço dedicado de gerenciamento de recursos

Todas as instâncias consultam e atualizam a mesma fonte de verdade, respeitando o limite global.

## 6. Recurso indisponível, mas prestes a ser devolvido

A decisão entre erro imediato ou espera depende da regra de negócio e da experiência do usuário.

Algumas aplicações retornam erro imediato; outras colocam a solicitação em fila de espera.

Fatores que influenciam essa decisão:

- tempo máximo aceitável de espera pelo cliente
- tempo médio de utilização do recurso
- criticidade da operação
- quantidade de usuários simultâneos
- capacidade de processamento do sistema

Uma abordagem comum é usar uma fila com timeout. Se o recurso for liberado dentro do prazo, a solicitação é atendida; caso contrário, retorna indisponibilidade.

Em cenários previsíveis, a escalabilidade automática também pode ajudar a aumentar a capacidade.
