import pyttsx3
import speech_recognition as sr
import datetime
import wikipediaapi
import webbrowser
import smtplib
import os
import random

# Initialize the text-to-speech engine
engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)  # Set the voice for the text-to-speech engine

def speak(audio):
    """
    Converts the input text to speech and plays it.

    Parameters:
        audio (str): Text to be spoken.
    """
    engine.say(audio)
    engine.runAndWait()  # This is necessary to actually hear the spoken text

def wishme():
    """
    Greets the user based on the current time of the day.
    """
    hour = int(datetime.datetime.now().hour)
    if hour >= 0 and hour < 12:
        speak("Good Morning!")
    elif hour >= 12 and hour < 18:
        speak("Good Afternoon!")
    else:
        speak("Good Evening!")
    speak("I am Jarvis, Please tell me how may I help you")

def takeCommand():
    """
    Listens to the user's voice input and converts it to text.
    
    Returns:
        str: The recognized text from the user's voice.
    """
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say something!")
        audio = r.listen(source)
    try:
        # Convert speech to text using Google's speech recognition API
        print("You said: " + r.recognize_google(audio))
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")

    try:
        print("Recognizing...")
        query = r.recognize_google(audio, language='en-in')  # Using Google for voice recognition.
        print(f"User said: {query}\n")  # Print recognized user query
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        return "None"
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return "None"
    except Exception as e:
        print(f"Error while recognizing: {e}")
        return "None"

    return query

def sendEmail(to, content):
    """
    Sends an email using SMTP protocol.
    
    Parameters:
        to (str): Recipient's email address.
        content (str): Content of the email.
    """
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()  # Secure the connection
    server.login('your_email@gmail.com', 'your_password')  # Login to your email account
    server.sendmail('your_email@gmail.com', to, content)  # Send the email
    server.close()


jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you get when you cross a snowman with a vampire? Frostbite.",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "What’s orange and sounds like a parrot? A carrot.",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "What do you call fake spaghetti? An impasta."
]

def tell_joke():
    """
    Randomly selects a joke from the list and speaks it.
    """
    joke = random.choice(jokes)
    speak(joke)

if __name__ == "__main__":
    wishme()  # Greet the user at the start
    while True:
        query = takeCommand().lower()  # Convert user query to lowercase for easier comparison

        if 'wikipedia' in query:
            # Search Wikipedia and provide a summary
            speak('Searching Wikipedia...')
            query = query.replace("wikipedia", "")
            results = wikipediaapi.summary(query, sentences=2)
            speak("According to Wikipedia")
            print(results)
            speak(results)
        elif 'open youtube' in query:
            webbrowser.open("youtube.com")  # Open YouTube in the default web browser
        
        elif 'open google' in query:
            webbrowser.open("google.com")  # Open Google in the default web browser
        
        elif 'open chat' in query:
            webbrowser.open("chat.openai.com")  # Open ChatGPT in the default web browser
        
        elif 'open whatsapp' in query:
            webbrowser.open("whatsapp.com")  # Open WhatsApp in the default web browser
        
        elif 'the time' in query:
            strTime = datetime.datetime.now().strftime("%H:%M:%S")
            speak(f"Sir, the time is {strTime}")  # Report the current time
        
        elif 'open spotify' in query:
            webbrowser.open("spotify.com")  # Open Spotify in the default web browser
        
        elif 'play music' in query:
            # Play a random song from the specified directory
            music_dir = 'D:\\Non Critical\\songs\\Favorite Songs2'
            songs = os.listdir(music_dir)
            print(songs)
            os.startfile(os.path.join(music_dir, songs[0]))
        
        elif 'email to me' in query:
            try:
                speak("What should I say?")
                content = takeCommand()  # Get the content of the email from the user
                to = "your_email@gmail.com"
                sendEmail(to, content)  # Send the email
                speak("Email has been sent!")
            except Exception as e:
                print(e)
                speak("Sorry my friend. I am not able to send this email")
        
        elif 'tell me a joke' in query:
            tell_joke()  # Tell a random joke
        
        elif 'your name' in query.lower():
            speak("I am Jarvis and I am here to assist you.")  # Provide the assistant's name
        
        elif 'who created you' in query.lower() or 'who made you' in query.lower():
            speak("I was created by Mr. Shreyash")  # Provide information about the creator
