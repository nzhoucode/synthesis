#!/bin/bash
/bin/ollama serve &
pid=$!
sleep 5
echo "Pulling model..."
ollama pull llama3
echo "Model pulled successfully."
wait $pid