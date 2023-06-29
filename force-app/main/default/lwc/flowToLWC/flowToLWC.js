import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
export default class FlowToLWC extends LightningElement {

    flowApiName="Food_Item_Selection"
    flowInputVariables=[
        
    ]
    handleFlowStatusChange(event){
        console.log("flow status", event.detail.status)
        if(event.detail.status==="FINISHED"){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success",
                    message:"Flow Finished Successfully",
                    variant:"success"
                })
            )
        }
    }

}