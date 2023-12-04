import { Component, OnInit } from '@angular/core';
import {Configuration, OpenAIApi} from "openai";
import { environment } from 'src/environments/environment';

import { gptModels } from '../models/constants';
import { ResponseModel } from '../models/gpt-response';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['demo.component.css'],
})
export class DemoComponent implements OnInit {
    response!: ResponseModel | undefined;
    gptModels = gptModels
    promptText = '';
    showSpinner = false;

  constructor() {
    
  }

  ngOnInit(): void {
    
  }

  checkResponse() {
    this.invokeGPT();
  }

  getText(data:string) {
    return data.split('\n').filter(f=>f.length>0);
  }

  async invokeGPT() {

    if(this.promptText.length<2)
    return;

    try{
      this.response =undefined;
      let configuration = new Configuration({apiKey: environment.apiKey});
      let openai = new OpenAIApi(configuration);

      // Creating the request payload for the createCompletion API 
      let requestData={
        model: 'text-davinci-003',
        prompt: this.promptText,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };


      this.showSpinner = true;
      let apiResponse =  await openai.createCompletion(requestData);

      this.response = apiResponse.data as ResponseModel;
      this.showSpinner = false;
    
    } catch(error:any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        
      }
    }
  }

  
}


//https://beta.openai.com/docs/api-reference/completions/create