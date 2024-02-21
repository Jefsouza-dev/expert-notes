import * as Dialog from "@radix-ui/react-dialog";

import { X } from "lucide-react";
import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";

interface InewNotCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: InewNotCardProps) {
  const [shouldShowOnboarding, SetShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, SetIsRecording] = useState(false);

  function handleStartEditor() {
    SetShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value: inputContent } = event.target;

    setContent(inputContent);

    if (inputContent === "") {
      SetShouldShowOnboarding(true);
    }
  }

  function handleSaveNewNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      return;
    }

    onNoteCreated(content);

    SetShouldShowOnboarding(true);

    setContent("");

    toast.success("Nota criada com sucesso");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIavailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition in window";

    if (!isSpeechRecognitionAPIavailable) {
      alert("Esse navegador não suporta gravação por audio");
      return;
    }

    SetIsRecording(true);
    SetShouldShowOnboarding(false);

    const speechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new speechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    SetIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition?.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-200">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>

            <form className="flex-1 flex flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {shouldShowOnboarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece{" "}
                    <button
                      className="font-medium text-lime-400 hover:underline"
                      onClick={handleStartRecording}
                      type="button"
                    >
                      gravando uma nota
                    </button>{" "}
                    em áudio ou se preferir{" "}
                    <button
                      className="font-medium text-lime-400 hover:underline"
                      onClick={handleStartEditor}
                      type="button"
                    >
                      ultilize apenas texto.
                    </button>
                  </p>
                ) : (
                  <textarea
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    autoFocus
                    onChange={handleContentChanged}
                    value={content}
                  />
                )}
              </div>

              {isRecording ? (
                <button
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium  hover:text-slate-100"
                  onClick={handleStopRecording}
                  type="button"
                >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                  Gravando! (clique para interromper)
                </button>
              ) : (
                <button
                  className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium  hover:bg-lime-500"
                  onClick={handleSaveNewNote}
                  type="button"
                >
                  Salvar nota
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
