```
@startuml
entity User {
  * id
  --
  * email
  * name
  * password
}

entity Figure{
  * id
  --
  * symbol
  * shape
  * color
  * measurement
}

User ||--o{ Figure



@enduml

```
