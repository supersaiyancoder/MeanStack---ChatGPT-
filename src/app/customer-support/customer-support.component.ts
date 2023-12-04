import { Component, OnInit } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { environment } from 'src/environments/environment';
import { gptModels } from '../models/constants';
import { ChatWithBot, ResponseModel } from '../models/gpt-response';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.css']
})
export class CustomerSupportComponent implements OnInit {
  chatConversation: ChatWithBot[] = [];
  response!: ResponseModel | undefined;
  gptModels = gptModels
  promptText = '';
  showSpinner = false;

  constructor() { }

  ngOnInit(): void {
  }

  checkResponse() {
    this.pushChatContent(this.promptText, 'You', 'person');
    this.invokeGPT();
    this.promptText = '';
  }


  pushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: ChatWithBot = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
  }


  getText(data: string) {
    return data.split('\n').filter(f => f.length > 0);
  }

  async invokeGPT() {


    if (this.promptText.length < 2)
      return;

    try {
      this.response = undefined;
      let configuration = new Configuration({ apiKey: environment.apiKey });
      let openai = new OpenAIApi(configuration);

     
    //  Making the API Payload . 
      let requestData = {
        model: 'text-davinci-003',
        prompt: this.promptText,
        temperature: 0.95,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };




      this.showSpinner = true;
      let apiResponse = await openai.createCompletion(requestData);

      this.response = apiResponse.data as ResponseModel;
      this.pushChatContent(this.response.choices[0].text.trim(), 'Mr Bot', 'bot');


      this.showSpinner = false;
    } catch (error: any) {
      this.showSpinner = false;

      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

        swal("Good job!", "You clicked the button!", {
          icon : "error",
          buttons: {
            confirm: {
              className : 'btn btn-danger'
            }
          },
        });

      } else {    }
    }
  }
}
function swal(arg0: string, arg1: string, arg2: { icon: string; buttons: { confirm: { className: string; }; }; }) {
  throw new Error('Function not implemented.');
}

