# Orders System

### Order Statuses

| Awaiting Approval | In Transit | Delivered | Cancelled | Rejected | Returned |
| :---------------- | :--------- | :-------- | :-------- | :------- | :------- |

---

### Order Management Lifecycle

```mermaid
graph TD;

    subgraph "Order Placement"
        A[Customer Places Order] --> Y(Invoice Generated <br/> Stock Decremented)--> B(Status: Pending Approval);
    end

    subgraph "Admin Review"
        B --> |Admin Approves| F(Status: In Transit);
        B --> |Admin Rejects| D(Status: Rejected);
        B --> |Customer Cancels| E(Status: Cancelled);
    end

    subgraph "Fulfillment"
        F --> |Delivery Confirmed| G(Status: Delivered,<br/>Dashboard: updated);
        F --> |Admin Rejects| D;
    end

    subgraph "Post-Delivery & Resolution"
        G --> |"Customer asks for return<br/>(from outside the website)"| H{Does the Admin accept the return?};
        H --> |Yes| K(Status: Returned,<br/>Dashboard: updated);
        H --> |No| G;

        E --> Z(Items Returned to Stock);
        D --> Z;
        K --> Z
    end

    %% Dark Mode Friendly Styles
    style A fill:#1d3557,color:#f1faee
    style B fill:#ca9800,color:#000
    style F fill:#ca9800,color:#000
    style G fill:#198754,color:#f8f9fa
    style D fill:#842029,color:#f8f9fa
    style E fill:#842029,color:#f8f9fa
    style K fill:#842029,color:#f8f9fa
```

```mermaid
graph TD;

        L{Is status delivered?<br/>OR<br/>Is the user an admin?}-->J(Allow user to comment in reviews)
```

:::note
Only the **financial report (Dashboard page)** will update if you delete a `Delivered` Order log, but the item's quantity & selling counter won't change; you must **reject** the order to return the items' numbers & sold items counter.

And if you delete the order log, the user won't be able to see it from their side or **review** the product.
:::

---

_Last updated on July 22, 2025 by Ayman._
