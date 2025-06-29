Feature: Manage todos in the Store

  Scenario: Initialize todos
    Given a fresh todo state
    When a "init" setTodos event arrives with todos:
      | id | title      | completed |
      | 1  | First todo | false     |
      | 2  | Second     | true      |
    Then the todosState should be:
      | id | title      | completed |
      | 1  | First todo | false     |
      | 2  | Second     | true      |
    And the todoIdsState should be:
      | id |
      | 1  |
      | 2  |

  Scenario: Add a todo
    Given a todo state with:
      | id | title      | completed |
      | 1  | First todo | false     |
    When a "onAdded" setTodos event arrives with todos:
      | id | title      | completed |
      | 2  | Second     | true      |
    Then the todosState should be:
      | id | title      | completed |
      | 1  | First todo | false     |
      | 2  | Second     | true      |
    And the todoIdsState should be:
      | id |
      | 1  |
      | 2  |

  Scenario: Delete a todo
    Given a todo state with:
      | id | title      | completed |
      | 1  | First todo | false     |
      | 2  | Second     | true      |
    When a "onDeleted" setTodos event arrives with todos:
      | id | title      | completed |
      | 1  | First todo | false     |
    Then the todosState should be:
      | id | title      | completed |
      | 2  | Second     | true      |
    And the todoIdsState should be:
      | id |
      | 2  |

  Scenario: Complete a todo
    Given a todo state with:
      | id | title      | completed |
      | 1  | First todo | false     |
    When a "onCompleted" setTodos event arrives with todos:
      | id | title      | completed |
      | 1  | First todo | true      |
    Then the todosState should be:
      | id | title      | completed |
      | 1  | First todo | true      |

  Scenario: Uncomplete a todo
    Given a todo state with:
      | id | title      | completed |
      | 1  | First todo | true      |
    When a "onUncompleted" setTodos event arrives with todos:
      | id | title      | completed |
      | 1  | First todo | false     |
    Then the todosState should be:
      | id | title      | completed |
      | 1  | First todo | false     |

  Scenario: Modify a todo title
    Given a todo state with:
      | id | title      | completed |
      | 1  | First todo | false     |
    When a "onModifiedTitle" setTodos event arrives with todos:
      | id | title      | completed |
      | 1  | New title  | false     |
    Then the todosState should be:
      | id | title      | completed |
      | 1  | New title  | false     |