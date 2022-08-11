let group = {};
let availableGroups = ["0-CreateGroup", "#-Exit"];
let availableGroups1 = [];
let group1 = {
  Name: [],
  Members: [],
  Expenses: [],
  whoPaid: [],
  paidDate: [],
};
var num = 0;
let GroupMembers = [];
let groupName,
  TotalAmount,
  a,
  Amount1,
  date,
  temp1,
  member,
  description,
  value,
  value2,
  value3,
  count,
  payee,
  objectGroups;
let createGroupCount = 0;
let temp = [];
let selectedMembers = [];

/*------------------------------------------------------------------------------------
                                 Start Splitwise
------------------------------------------------------------------------------------*/

function startSplitwise() {
  /*------------------------------------------------------------------------------------
                                 Create Json File
------------------------------------------------------------------------------------*/
  let today = new Date();

  /*------------------------------------------------------------------------------------
                                 Read Json File
------------------------------------------------------------------------------------*/
  const fs = require("fs");
  const jsonData = require("./splitWisedata.json");
  objectGroups = Object.keys(jsonData);
  createGroupCount += objectGroups.length;
  for (let i = 1; i <= objectGroups.length; i++) {
    availableGroups.push(i + "-" + objectGroups[i - 1]);
  }
  console.log("Welcome to SplitWise");
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  enterGroup(rl);
}

/*------------------------------------------------------------------------------------
                            Show the Available Groups
------------------------------------------------------------------------------------*/

function enterGroup(rl) {
  console.log("AVAILABLE GROUPS ");
  availableGroups.forEach((availableGroups) => {
    console.log(availableGroups);
  });
  rl.question("Select option :", (answer) => {
    temp1 = answer;
    if (answer == 0) {
      createGroupCount += 1;
      createObj();
      createGroup(rl);
    }
    if (answer >= 1 && availableGroups.length > 2) {
      selectOption(rl);
    }
    //  else {
    //   console.log("\t\tGROUPS NOT AVAILABLE CREATE GROUP");
    //   // enterGroup(rl);
    // }
    if (answer == "#") {
      const fs = require("fs");
      const data = JSON.stringify(group);
      fs.writeFile("./splitWisedata.json", data, function (err) {
        if (err) console.log("error", err);
      });
      endSplitwise(rl);
    }
  });
}

/*------------------------------------------------------------------------------------
                           Function for Create Group
------------------------------------------------------------------------------------*/

function createGroup(rl) {
  rl.question("Create the Group :\n ", (addName) => {
    groupName = addName.toUpperCase();
    if (createGroupCount >= 1) {
      availableGroups.push(createGroupCount + "-" + groupName);
      availableGroups1.push(groupName);
    }

    group1.Name.push(groupName);
    group.rename = group1;
    rename(rl);
  });
}

/*------------------------------------------------------------------------------------
                      Function for Create NewObj for Every Groups
------------------------------------------------------------------------------------*/

function createObj() {
  group1 = {
    Name: [],
    Members: [],
    Expenses: [],
    whoPaid: [],
    paidDate: [],
  };
}

/*------------------------------------------------------------------------------------
                          Function for Rename the Object 
------------------------------------------------------------------------------------*/

function rename(rl) {
  group[groupName] = group.rename;
  delete group.rename;
  console.log(group);
  enterGroup(rl);
}

/*------------------------------------------------------------------------------------
                          Function for SelectOptions
------------------------------------------------------------------------------------*/

function selectOption(rl) {
  console.log(
    "0- AddGroupMembers \n1- AddExpenses \n2- SelectMembers \n#- Back"
  );
  rl.question("Select option :", (answer) => {
    if (answer == 0 || answer == 1 || answer == 2 || answer == "#") {
      if (answer == 0) {
        addGroupMembers(rl);
      }
      if (answer == 1) {
        if (group[availableGroups1[temp1 - 1]].Members.length >= 1) {
          addAmount(rl);
        } else {
          console.log("\t\tPLEASE ADD GROUPMEMBERS FIRST");
          selectOption(rl);
        }
      }
      if (answer == 2) {
        if (group[availableGroups1[temp1 - 1]].Expenses.length >= 1) {
          selectMembers(rl);
        } else {
          console.log("\t\tPLEASE ADD EXPENSES FIRST");
          selectOption(rl);
        }
      }
      if (answer == "#") {
        enterGroup(rl);
      }
    } else {
      console.log("PLEASE CHOOSE ANY OPTIONS AVAILABLE HERE");
      selectOption(rl);
    }
  });
}

/*------------------------------------------------------------------------------------
                          Function for Add GroupMembers
------------------------------------------------------------------------------------*/

function addGroupMembers(rl) {
  console.log("Enter GroupMembers Name like this example(a,b,c)");
  rl.question("Enter GroupMembers Name:\n", (name) => {
    GroupMembers = name.split(",");
    for (let i = 0; i < GroupMembers.length; i++) {
      group[availableGroups1[temp1 - 1]].Members.push(GroupMembers[i]);
      group;
    }

    console.log(group);
    selectOption(rl);
  });
}

/*------------------------------------------------------------------------------------
                              Function for Add Expenses
------------------------------------------------------------------------------------*/

function addAmount(rl) {
  rl.question("Enter Total Amount :  ₹ ", (Amount) => {
    TotalAmount = Amount;
    rl.question("Enter the Description:  ", (answer) => {
      description = answer.toUpperCase();
      group[availableGroups1[temp1 - 1]].Expenses.push(description);
      console.log(group);
      selectOption(rl);
    });
  });
}

/*------------------------------------------------------------------------------------
                               Function for SelectMembers
------------------------------------------------------------------------------------*/

function selectMembers(rl) {
  console.log(
    "Group Members are " + group[availableGroups1[temp1 - 1]].Members
  );
  console.log("Select Members  like this (example: x,y,z)");
  rl.question("Select Members :\n", (members) => {
    selectedMembers = members.split(",");
    console.log("Selected Members are : " + selectedMembers);
    for (let i = 0; i < selectedMembers.length; i++) {
      count = 0;
      for (
        let j = 0;
        j < group[availableGroups1[temp1 - 1]].Members.length;
        j++
      ) {
        if (
          selectedMembers[i] != group[availableGroups1[temp1 - 1]].Members[j]
        ) {
          count += 1;
          if (count == group[availableGroups1[temp1 - 1]].Members.length) {
            temp.push(selectedMembers[i]);
          }
        } else if (
          selectMembers[i] == group[availableGroups1[temp1 - 1]].Members[j]
        ) {
          console.log(group[availableGroups1[temp1 - 1]].Members[j]);
          temp = [];
        }
      }
    }

    if (temp.length == 0) {
      addWhoPaid(rl);
    } else {
      console.log(temp + " is not available in this Group");
      rl.question(
        "Do you want to add " + temp + " to this Group (y/n):",
        (answer5) => {
          if (answer5 == "y" || answer5 == "Y") {
            addNewMemberToGroup(rl);
          } else if (answer5 == "n" || answer5 == "N") {
            temp = [];
            selectMembers(rl);
          }
        }
      );
    }
  });
}

/*------------------------------------------------------------------------------------
                                Function for Select who Paid
------------------------------------------------------------------------------------*/

function addWhoPaid(rl) {
  rl.question("Select Who paid :\t", (name1) => {
    member = name1;
    payee = false;
    for (
      let i = 0;
      i < group[availableGroups1[temp1 - 1]].Members.length;
      i++
    ) {
      if (
        selectedMembers[i] == member ||
        group[availableGroups1[temp1 - 1]].Members[i] == member
      ) {
        payee = true;
      }
    }

    if (payee == true) {
      // console.log("Enter date Like this (yyyy-mm-dd)")
      rl.question("Amount paid date :", (answer2) => {
        date = answer2;
        group[availableGroups1[temp1 - 1]].whoPaid.push(member);
        group[availableGroups1[temp1 - 1]].paidDate.push(date);
        splitBy(rl);
      });
    } else {
      console.log(member + " is not Selected in this Expenses");
      rl.question(
        "Do you want to Add " + member + " to this Expenses (y/n):",
        (answer1) => {
          if (answer1 == "y" || answer1 == "Y") {
            addNewMember(rl);
          } else if (answer1 == "n" || answer1 == "N") {
            addWhoPaid(rl);
          }
        }
      );
    }
  });
}

/*------------------------------------------------------------------------------------
                           Function for Select Split Options
------------------------------------------------------------------------------------*/

function splitBy(rl) {
  rl.question("Equally  or unEqually (e/u) : \t", (Answer) => {
    console.log(description);
    console.log(date + " " + member + " paid" + " ₹" + TotalAmount);
    value = Answer;
    if (value == "e" || value == "E") {
      Equally(rl);
    } else if (value == "u" || value == "U") {
      unEqually(rl, num);
    } else {
      console.log("\t\tPLEASE CHOOSE ANY OPTIONS AVAILABLE HERE");
      splitBy(rl);
    }
  });
}

/*------------------------------------------------------------------------------------
                              Function for Split Equally
------------------------------------------------------------------------------------*/

function Equally(rl) {
  a = TotalAmount / selectedMembers.length;
  for (let i = 0; i < selectedMembers.length; i++) {
    console.log(selectedMembers[i] + " owes " + " ₹" + a);
  }

  addMoreExpenses(rl);
}

/*------------------------------------------------------------------------------------
                              Function for Split UnEqually
------------------------------------------------------------------------------------*/

function unEqually(rl) {
  if (num < selectedMembers.length) {
    rl.question("Enter " + selectedMembers[num] + " owes : ", (value) => {
      Amount1 = value;
      console.log(selectedMembers[num] + " owes :" + " ₹ " + Amount1);
      TotalAmount -= Amount1;
      console.log("\n Remaining Amount is: " + " ₹" + TotalAmount);
      num += 1;
      unEqually(rl, num);
      addMoreExpenses(rl);
    });
  }
}

/*------------------------------------------------------------------------------------
                        Function for AddNewMember To SelectedMembers
------------------------------------------------------------------------------------*/

function addNewMember(rl) {
  GroupMembers.push(member);
  group[availableGroups1[temp1 - 1]].Members.push(member);
  selectedMembers.push(member);
  addWhoPaid(rl);
}

/*------------------------------------------------------------------------------------
                         Function for addNewMember To Group
------------------------------------------------------------------------------------*/

function addNewMemberToGroup(rl) {
  GroupMembers.push(temp);
  group[availableGroups1[temp1 - 1]].Members.push(temp);
  selectedMembers.push(temp);
  selectMembers(rl);
}

/*------------------------------------------------------------------------------------
                         Function for Add More Expenses
------------------------------------------------------------------------------------*/

function addMoreExpenses(rl) {
  const fs = require("fs");
  const data = JSON.stringify(group);
  fs.writeFile("./splitWisedata.json", data, function (err) {
    if (err) console.log("error", err);
  });
  rl.question("Do you want to add more Expenses(y/n):\t", (answer3) => {
    num = 0;
    value2 = answer3;
    if (value2 == "Y" || value2 == "y") {
      addAmount(rl);
    } else if (value2 == "n" || value2 == "N") {
      rl.question("Do you want to add more Groups(y/n):\t", (answer4) => {
        value3 = answer4;
        if (value3 == "Y" || value3 == "y") {
          enterGroup(rl);
        } else if (value3 == "n" || value3 == "N") {
          endSplitwise(rl);
        }
      });
    } else {
      console.log("\t\tPLEASE CHOOSE ANY OPTIONS AVAILABLE HERE");
      addMoreExpenses(rl);
    }
  });
}

/*------------------------------------------------------------------------------------
                    Function for End Splitwise
------------------------------------------------------------------------------------*/

function endSplitwise(rl) {
  const fs = require("fs");
  const data = JSON.stringify(group);
  fs.writeFile("./splitWisedata.json", data, function (err) {
    if (err) console.log("error", err);
  });
  console.log(data);

  rl.close();
}

startSplitwise();
