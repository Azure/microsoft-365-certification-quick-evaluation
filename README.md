# Get Microsoft 365 Quick Assessments Action

Get Microsoft 365 Quick Assessments Action is part of App Compliance Automation Tool(ACAT). With get Microsoft 365 quick assessments Action you can now get Microsoft 365 quick assessments of Azure Resources by report or by deployment from your Github Workflows. Since the get Microsoft 365 quick assessments action can be added directly after the resource deployment, you can have a immediately result of the compliance status of resources deployed this time. Its now even easier to follow safe deployment practices and catch non-compliant issues. 

New to ACAT? Its an Azure service that help you to get M365 compliance certificate easily. To know more check out: [What is App Compliance Automation Tool(ACAT)](https://learn.microsoft.com/en-us/microsoft-365-app-certification/docs/acat-overview)

The definition of this Github Action is in [action.yml]()


# Pre-requisites:
* Azure Login Action: Authenticate using [Azure Login](https://github.com/Azure/login)  action. The get Microsoft 365 quick assessments action assumes that Azure Login is done using an Azure service principal that has [sufficient permissions](https://docs.microsoft.com/en-us/azure/governance/policy/overview#rbac-permissions-in-azure-policy) trigger and get quick assessment on the selected scopes. Once login is done, the next set of actions in the workflow can perform tasks such as geting quick assessments by report or by deployment. For more details on permissions, checkout 'Configure credentials for Azure login action' section in this page  or alternatively you can refer the full [documentation](https://github.com/Azure/login) of Azure Login Action.
* Create an ACAT report(optional): Go to Azure Portal to create an ACAT report for you application, see [ACAT tutorial](https://learn.microsoft.com/en-us/microsoft-365-app-certification/docs/automate-certification-with-acat). At least one of the 2 optional pre-requisites `Create an ACAT report` and `Prepare the deployment id` must be done.
* Prepare the deployment id(optional): You can also get quick assessment by your deployment, set the deployment id as output in your former deploy action, and take the deployment id as input of get Microsoft 365 quick assessments action. At least one of the 2 optional pre-requisites `Create an ACAT report` and `Prepare the deployment id` must be done.



# Inputs for the Action

* `cred`: mandatory. The credential you use to get Microsoft 365 quick assessments. This cred should be the same with the one in login.
* `report-name`: Optional. If you want to get Microsoft 365 quick assessments by report, you should create a report before you run the github action and set the report-name value the name of the report you created.[How to create an ACAT report](https://learn.microsoft.com/en-us/microsoft-365-app-certification/docs/automate-certification-with-acat).At least one of the 2 parameters `report-name` and `deployment-id` must be filled. (If both `report-name` and `deployment-id` are filled, the action will help get assessments of the resources in the deployments, and update the report's resource list with the resources in the deployment).
* `deployment-id`: Optional. If you want to get Microsoft 365 quick assessments by deployment, you should get the id of your deployment, and pass the value to `deployment-id`. At least one of the 2 parameters `report-name` and `deployment-id` must be filled.(If both `report-name` and `deployment-id` are filled, the action will help get assessments of the resources in the deployments, and update the report's resource list with the resources in the deployment).


# End-to-End Sample Workflows

  
### Sample workflow to get Microsoft 365 quick assessments by report.


```yaml
# File: .github/workflows/workflow.yml

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    name: Test artifact
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Azure login
      uses: Azure/login@v1.4.6
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: analyse Microsoft 365 compliance results
      uses: azure/get-microsoft-365-quick-assessment@v0
      with:
        cred: ${{ secrets.AZURE_CREDENTIALS }}
        report-name: 'test-report'
        
```
The above workflow will get assessments by report.


### Sample workflow to get Microsoft 365 quick assessments by ARM template deployment.


```yaml
# File: .github/workflows/workflow.yml

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    name: Test artifact
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Azure login
      uses: Azure/login@v1.4.6
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Deploy with ARM template
      id: deployarm
      uses: azure/arm-deploy@v1
      with:
        subscriptionId: ${{ secrets.SUBSCRIPTION_ID }}
        resourceGroupName: ${{ secrets.RESOURCE_GROUP}}
        template: ./deploy/Storage.template.json
        parameters: storageAccountType=Standard_LRS
    - run: echo ${{ steps.deployarm.outputs.deploymentId }}

    - name: analyse Microsoft 365 compliance results
      uses: azure/get-microsoft-365-quick-assessment@v0
      with:
        cred: ${{ secrets.AZURE_CREDENTIALS }}
        deployment-id: ${{ steps.deployarm.outputs.deploymentId }}
        
```
The above workflow will get Microsoft 365 quick assessments by ARM template deployment. 


### Sample workflow to get Microsoft 365 quick assessments by bicep deployment.


```yaml
# File: .github/workflows/workflow.yml

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    name: Test artifact
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Azure login
      uses: Azure/login@v1.4.6
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    - name: Deploy with bicep
      id: deploybicep
      uses: azure/arm-deploy@v1
      with:
        subscriptionId: ${{ secrets.SUBSCRIPTION_ID }}
        resourceGroupName: ${{ secrets.RESOURCE_GROUP}}
        template: ./deploy/Storage.bicep
        parameters: storageAccountType=Standard_LRS
    - run: echo ${{ steps.deploybicep.outputs.deploymentId }}

    - name: analyse Microsoft 365 compliance results
      uses: azure/get-microsoft-365-quick-assessment@v0
      with:
        cred: ${{ secrets.AZURE_CREDENTIALS }}
        deployment-id: ${{ steps.deployarm.outputs.deploymentId }}
        
```
The above workflow will get Microsoft 365 quick assessments by bicep deployment. 






# Configure credentials for Azure login action:

With the Azure login Action, you can perform an Azure login using [Azure service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals). The credentials of Azure Service Principal can be added as [secrets](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables) in the GitHub repository and then used in the workflow. Follow the below steps to generate credentials and store in github.


  * Prerequisite: You should have installed Azure cli on your local machine to run the command or use the cloudshell in the Azure portal. To install Azure cli, follow [Install Azure Cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). To use cloudshell, follow [CloudShell Quickstart](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart). After you have one of the above ready, follow these steps: 
  
  
  * To create service principal that has access over subscription scope, run the below Azure CLI command and copy the output JSON object to your clipboard.

```bash  
  
   az ad sp create-for-rbac --name "myApp" --role "Resource Policy Contributor"  \
                            --scopes  /subscriptions/{subscription-id} \

                            
  # Replace {subscription-id} with the subscription identifier
  
  # The command should output a JSON object similar to this:

  {
    "appId": "<GUID>",
    "displayName": "<display-name>",
    "name": "<url>",
    "password": "<GUID>",
    "tenant": "<GUID>"
  }

  # Assign the Contributor role to the new created service principal
   az role assignment create --assignee "{appId}" --role "Contributor"  \
                            --scopes  /subscriptions/{subscription-id} \
  
  # copy the GUID values for appId, password and tenant from above JSON and replace them in the following JSON. Once replaced, copy the JSON to clipboard
   
  {
    "clientId": "<appId>",
    "clientSecret": "<password>",  
    "tenantId": "<tenant>"
  }
  
  
  
```

  * Define a 'New secret' under your GitHub repository settings -> 'Secrets' menu. Lets name it 'AZURE_CREDENTIALS'.
  * Paste the contents of the clipboard as the value of  the above secret variable.
  * Use the secret variable in the Azure Login Action(Refer the End-to-End Sample Workflows section )

```
# Feedback

If you have any changes you’d like to see or suggestions for this action,  we’d love your feedback ❤️ . Please feel free to raise a GitHub issue in this repository describing your suggestion. This would enable us to label and track it properly. You can do the same if you encounter a problem with the feature as well.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.



This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.