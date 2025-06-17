# Coleção `delivery_men` - Firebase Firestore

Esta documentação descreve a estrutura da coleção `delivery_men` no Firebase Firestore, que armazenará os dados dos entregadores. Também aborda a relação com a coleção `orders` para a designação de pedidos.

---

## Estrutura da Coleção `delivery_men`

Cada documento nesta coleção representará um entregador e terá os seguintes campos:

* **`uid` (String - ID do documento)**
    * **Descrição:** O identificador único do entregador. Recomenda-se usar o **UID do Firebase Authentication** para facilitar a integração e a segurança.
    * **Exemplo:** `"f3d4e5f6-7g8h-9i0j-1k2l-3m4n5o6p7q8r"`

* **`name` (String)**
    * **Descrição:** Nome completo do entregador.
    * **Exemplo:** `"João da Silva"`

* **`phone_number` (String)**
    * **Descrição:** Número de telefone para contato direto com o entregador.
    * **Exemplo:** `"+5571999998888"`

* **`email` (String - Opcional, mas recomendado)**
    * **Descrição:** Endereço de e-mail do entregador, que pode ser usado para comunicação ou login.
    * **Exemplo:** `"joao.silva@example.com"`

* **`status` (String)**
    * **Descrição:** Indica a disponibilidade atual do entregador.
    * **Valores Sugeridos:**
        * `"available"`: Disponível para receber novos pedidos.
        * `"on_delivery"`: Atualmente realizando uma entrega.
        * `"offline"`: Não disponível no momento.
        * `"paused"`: Em uma pausa.
    * **Exemplo:** `"available"`

* **`location` (GeoPoint)**
    * **Descrição:** A última localização geográfica conhecida do entregador. Essencial para designação de pedidos com base na **proximidade**.
    * **Exemplo:** `GeoPoint(-12.9711, -38.5108)` (latitude e longitude para Salvador, Bahia).

* **`vehicle_type` (String)**
    * **Descrição:** Tipo de veículo utilizado pelo entregador.
    * **Valores Sugeridos:**
        * `"motorcycle"`
        * `"car"`
        * `"bicycle"`
        * `"foot"`
    * **Exemplo:** `"motorcycle"`

* **`vehicle_plate` (String - Opcional)**
    * **Descrição:** Placa de identificação do veículo do entregador.
    * **Exemplo:** `"ABC-1234"`

* **`delivery_history` (Array de Map - Opcional, mas útil)**
    * **Descrição:** Um histórico de entregas concluídas pelo entregador. Cada item pode ser um objeto com o ID do pedido e a data de conclusão.
    * **Exemplo:**
        ```json
        [
            { "order_id": "order_id_1", "completed_at": "2025-06-14T10:30:00Z" },
            { "order_id": "order_id_2", "completed_at": "2025-06-14T11:45:00Z" }
        ]
        ```

* **`current_assigned_order` (String - Opcional, mas crucial)**
    * **Descrição:** O ID do pedido que o entregador está designado a entregar no momento. Será `null` se não houver nenhum pedido designado.
    * **Exemplo:** `"order_id_5"` ou `null`

* **`rating` (Number - Opcional)**
    * **Descrição:** A avaliação média do entregador, baseada no feedback dos clientes (escala de 0 a 5, por exemplo).
    * **Exemplo:** `4.8`

* **`total_deliveries` (Number - Opcional)**
    * **Descrição:** O número total de entregas concluídas pelo entregador.
    * **Exemplo:** `150`

* **`is_active` (Boolean)**
    * **Descrição:** Um flag para indicar se o perfil do entregador está ativo no sistema.
    * **Exemplo:** `true`

* **`created_at` (Timestamp)**
    * **Descrição:** A data e hora em que o registro do entregador foi criado.
    * **Exemplo:** `Timestamp.fromDate(new Date())`

* **`updated_at` (Timestamp)**
    * **Descrição:** A data e hora da última atualização no registro do entregador.
    * **Exemplo:** `Timestamp.fromDate(new Date())`

---

## Relação com a Coleção `orders`

Para designar pedidos aos entregadores, a coleção `orders` (pedidos) deve conter os seguintes campos relevantes:

* **`order_id` (String - ID do documento)**
    * O código exclusivo de cada pedido.
    * **Exemplo:** `"PEDIDO_A1B2C3"`

* **`assigned_delivery_man_id` (String)**
    * O `uid` do entregador da coleção `delivery_men` que foi designado para este pedido. Este campo será atualizado quando um entregador for associado ao pedido.
    * **Exemplo:** `"f3d4e5f6-7g8h-9i0j-1k2l-3m4n5o6p7q8r"`

* **`delivery_status` (String)**
    * O status atual do processo de entrega do pedido.
    * **Valores Sugeridos:** `"pending"`, `"assigned"`, `"picking_up"`, `"on_the_way"`, `"delivered"`, `"cancelled"`.
    * **Exemplo:** `"assigned"`

* **`delivery_code` (String)**
    * Um código específico do pedido, que pode ser usado pelo entregador para confirmar a coleta ou entrega. Pode ser o próprio `order_id` ou um código gerado para essa finalidade.
    * **Exemplo:** `"DC-7890"`

---

## Fluxo de Designação de Pedidos

1.  **Criação do Pedido:** Um novo pedido é criado na coleção `orders` com `delivery_status: "pending"` e `assigned_delivery_man_id: null`.
2.  **Busca por Entregador:** O sistema identifica entregadores disponíveis (`status: "available"`, `current_assigned_order: null`).
3.  **Designação:**
    * O `assigned_delivery_man_id` do pedido é atualizado com o `uid` do entregador selecionado.
    * O `current_assigned_order` do entregador é atualizado com o `order_id` do pedido.
    * O `status` do entregador pode ser alterado para `"on_delivery"`.
    * O `delivery_status` do pedido é alterado para `"assigned"`.
4.  **Conclusão da Entrega:**
    * Após a entrega, o `delivery_status` do pedido é atualizado para `"delivered"`.
    * O `current_assigned_order` do entregador retorna para `null`.
    * O `status` do entregador pode voltar para `"available"`.
    * O campo `total_deliveries` do entregador é incrementado.

---

## Próximos Passos

Com esta estrutura, você está pronto para começar a implementar a lógica de gerenciamento de entregadores. Lembre-se de definir as **Firebase Security Rules** adequadamente para proteger seus dados e garantir que apenas usuários autorizados possam acessá-los e modificá-los.