Feature: Exercise Management

   Scenario: Add an exercise
    Given I have no exercises
    When I add an exercise
    Then the exercise should be added to my list

  Scenario: Get all exercises
    Given I have an exercise
    When I get all exercises
    Then I should see my exercise in the list

  Scenario: Cannot add an exercise with the same name
    Given I have added an exercise named "Running"
    When I try to add another exercise named "Running"
    Then I should see an error message that the exercise already exists

  Scenario: Update an exercise
    Given I have added an exercise named "Running"
    When I update the "Running" exercise to last 45 minutes
    Then the "Running" exercise should show a duration of 45 minutes

  Scenario: Delete an exercise
    Given I have added an exercise named "Running"
    When I delete the "Running" exercise
    Then the "Running" exercise should no longer be in my list