<template>
  <div class="hello">
    <div class="title">Nexxathon TLV Team-2 App</div>
    <div v-if="data">
      {{ data.message }}
    </div>
    <div v-else>
      Loading data...
    </div>
  </div>
  <div class="OpenAI">
    <input class="txtPrompt" v-model="prompt" placeholder="Enter your prompt" @keyup.enter="fetchOpenAIResponse">
    <button @click="fetchOpenAIResponse">Submit</button>
    <div v-if="openAiResponse">
      <p>Response: {{ openAiResponse.choices[0].message.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const data = ref(null); // Use a ref to store your fetched data
const prompt = ref(''); // Define a ref for the prompt
const openAiResponse = ref(null); // Define a ref for the OpenAI response

const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data.value = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const fetchOpenAIResponse = async (selectedText) => {
  try {
    const promptText = (selectedText && typeof selectedText === 'string') ? selectedText : prompt.value
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: promptText, clientId: "mako-news-123456" })
    });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await res.json();
    openAiResponse.value = jsonResponse;
    prompt.value = '';
  } catch (error) {
    console.error('Error:', error);
  }
};

const startHighlightListener = () => {
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', handleSelection);
  // document.addEventListener('selectionchange', () => {
  //   const selection = window.getSelection();
  //   const selectedText = selection.toString();
  //
  //   if (selectedText.length > 0) {
  //     console.log(`User has selected: ${selectedText}`);
  //     fetchOpenAIResponse(selectedText)
  //     // You can perform additional actions here, such as displaying the selected text in a specific element.
  //   }
  // })
}

function handleSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString();

  if (selectedText.length > 0) {
    console.log(`User has selected: ${selectedText}`);
    fetchOpenAIResponse(selectedText)
    // Perform your action here
  }
}

onMounted(() => {
  fetchData();
  startHighlightListener()
});
</script>

<style scoped>
.title {
  font-weight: bold;
}
.OpenAI input.txtPrompt {
  width: 70%;
  height: 40px;
  margin-top: 25px;
  padding: 0px 7px;
}
.OpenAI button {
  display: none;
}
</style>
