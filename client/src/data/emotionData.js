const emotionsExplained = [
    {
      emotion: "Embarrassed",
      tips: [
        "Feeling embarrassed is like when you blush or feel shy because you think others noticed something you did.",
        "It's okay to make mistakes, and feeling embarrassed can help you learn and grow.",
        "Share your feelings with someone you trust, and remember, everyone makes mistakes sometimes.",
      ],
    },
    {
      emotion: "Confused",
      tips: [
        "Feeling confused is like when you're trying to put together a big puzzle, and some pieces are missing.",
        "Ask questions, talk to someone you trust, and take your time. It's okay not to have all the answers right away; you're still learning!",
      ],
    },
    {
      emotion: "Pressured",
      tips: [
        "Feeling pressured is when you have a lot to do, and it feels like you're in a hurry.",
        "Remember, it's okay to take breaks and ask for help. You're doing your best, and it's okay to take things one step at a time.",
      ],
    },
    {
      emotion: "Overwhelmed",
      tips: [
        "Overwhelm is when you have so many things to do that it feels like a big wave crashing over you.",
        "Make a list of what you need to do, and start with one thing at a time. Don't be afraid to ask for help; you're not alone in this!",
      ],
    },
    {
      emotion: "Worried",
      tips: [
        "Worrying is when you think about things that might go wrong or make you feel sad.",
        "Share your worries with someone who cares about you. They can give you hugs and help you find ways to feel better.",
      ],
    },
    {
      emotion: "Anxious",
      tips: [
        "Anxiety is when you feel really, really worried and your tummy might feel funny.",
        "Take deep breaths and think about happy things. It's okay to feel anxious sometimes, and it will get better.",
      ],
    },
    {
      emotion: "Glad",
      tips: [
        "Feeling glad is like having a warm and happy feeling inside because something good happened.",
        "Celebrate and share your happiness with others. It's a wonderful feeling to spread!",
      ],
    },
    {
      emotion: "Ambitious",
      tips: [
        "When you feel ambitious, it's like having a special energy inside you that makes you want to work hard and try your best to make your dreams come true.",
        "Feeling ambitious is like having a superpower that makes everything exciting. So, dream big and try new things!",
      ],
    },
    {
      emotion: "Confident",
      tips: [
        "Feeling confident is when you believe in yourself and know that you can do things well.",
        "Keep practicing and trying new things to build your confidence even more. You're capable of great things!",
      ],
    },
    {
      emotion: "Determined",
      tips: [
        "Determined is like having a strong and brave feeling inside you when you really want to finish something.",
        "With determination, you can learn cool stuff. Even if it feels tricky at the start, you keep trying until you get really good at it.",
      ],
    },
    {
      emotion: "Proud",
      tips: [
        "Feeling proud is when you're really happy and satisfied with something you accomplished.",
        "Tell someone you trust about what you did; they'll be proud of you too! Keep up the good work!",
      ],
    },
    {
      emotion: "Excited",
      tips: [
        "Being excited is when you can't wait for something fun or special that's about to happen.",
        "Count down the days and share your excitement with friends. The anticipation is part of the adventure!",
      ],
    },
    {
      emotion: "Hurt",
      tips: [
        "Feeling hurt is like having an ouchie on your heart because something or someone made you sad.",
        "It's okay to talk to someone you trust about your feelings, and they can help you feel better and give you hugs.",
      ],
    },
    {
      emotion: "Lonely",
      tips: [
        "Feeling lonely is when you wish you had someone to talk to or be with.",
        "Reach out to a friend or family member, or find something fun to do to help chase away the lonely feelings.",
      ],
    },
    {
      emotion: "Guilty",
      tips: [
        "Feeling guilty is when you think you did something wrong and it makes your heart feel heavy.",
        "Apologize if you need to, and try to make things right. Everyone makes mistakes sometimes.",
      ],
    },
    {
      emotion: "Sad",
      tips: [
        "Feeling sad is when you have big tears in your eyes and your heart feels heavy.",
        "It's okay to cry and share your feelings with someone who cares about you. They'll be there to give you comfort.",
      ],
    },
    {
      emotion: "Disappointed",
      tips: [
        "Feeling disappointed is like when you were hoping for something, but it didn't happen the way you wanted.",
        "Talk about your feelings with someone, and maybe you can find a new plan or something else to look forward to.",
      ],
    },
    {
      emotion: "Ashamed",
      tips: [
        "Feeling ashamed is when you're really embarrassed about something you did.",
        "Remember that making mistakes is part of growing up, and it's okay to learn from them and do better next time.",
      ],
    },
    {
      emotion: "Hopeful",
      tips: [
        "Feeling hopeful is like having a bright and happy feeling because you believe good things can happen.",
        "Share your hope and positivity with others; it's like giving them a little bit of sunshine!",
      ],
    },
    {
      emotion: "Grateful",
      tips: [
        "Feeling grateful is when you're really, really thankful for something or someone special in your life.",
        "Say 'thank you' and let the people you appreciate know how much they mean to you. It makes everyone feel warm and fuzzy inside.",
      ],
    },
    {
      emotion: "Secure",
      tips: [
        "Feeling secure is when you feel safe and protected, like being wrapped in a warm, cozy blanket.",
        "Enjoy the feeling of security and know that you are loved and cared for.",
      ],
    },
    {
      emotion: "Thoughtful",
      tips: [
        "Being thoughtful is when you take the time to think about how your actions might affect others.",
        "Spread kindness and thoughtfulness; it's like sprinkling happiness wherever you go.",
      ],
    },
    {
      emotion: "Peaceful",
      tips: [
        "Feeling peaceful is like having a calm and quiet mind, like a peaceful pond without ripples.",
        "Enjoy the serenity and take deep breaths to keep that peaceful feeling alive.",
      ],
    },
    {
      emotion: "Content",
      tips: [
        "Feeling content is when you're happy with what you have and not wanting more.",
        "Appreciate the simple joys in life and share your contentment with a smile.",
      ],
    },
    {
      emotion: "Threatened",
      tips: [
        "Feeling threatened is when you're scared because you think something or someone might hurt you.",
        "Talk to a trusted adult about your concerns and remember that they'll help protect you.",
      ],
    },
    {
      emotion: "Insecure",
      tips: [
        "Feeling insecure is when you doubt yourself and think you're not good enough.",
        "Remember that everyone has strengths and weaknesses, and it's okay to ask for help when you need it.",
      ],
    },
    {
      emotion: "Scared",
      tips: [
        "Feeling scared is when you're really afraid of something, like a big, spooky monster under the bed.",
        "Find comfort in a trusted adult's presence, and remember that many things that seem scary are not as frightening as they seem.",
      ],
    },
    {
      emotion: "Rejected",
      tips: [
        "Feeling rejected is like when you think others don't want to be friends or include you.",
        "Reach out to people who care about you and find ways to make new friends; you're a special person worthy of love and friendship.",
      ],
    },
    {
      emotion: "Intimidated",
      tips: [
        "Feeling intimidated is when someone or something makes you feel small or scared.",
        "Remember that you're strong and capable. Stand tall and face your fears; you've got this!",
      ],
    },
    {
      emotion: "Helpless",
      tips: [
        "Feeling helpless is like when you think you can't do anything to change a situation.",
        "Talk to someone you trust about what's going on, and together, you can find solutions and take action.",
      ],
    },
    {
      emotion: "Grumpy",
      tips: [
        "Feeling grumpy is when you're in a bad mood and might not want to smile or talk much.",
        "It's okay to have grumpy days; take some time to relax and do things that make you happy.",
      ],
    },
    {
      emotion: "Disgusted",
      tips: [
        "Feeling disgusted is when something makes you feel yucky or grossed out.",
        "Avoid things that make you feel disgusted and focus on the things that make you feel happy and comfortable.",
      ],
    },
    {
      emotion: "Jealous",
      tips: [
        "Feeling jealous is like when you wish you had something someone else has, like a cool toy or a special treat.",
        "Instead of feeling jealous, try being happy for them and think about the wonderful things you have in your life.",
      ],
    },
    {
      emotion: "Frustrated",
      tips: [
        "Feeling frustrated is when things aren't going your way, and it makes you feel a bit angry and stuck.",
        "Take a deep breath and try to find a solution or ask for help. Frustrations can turn into opportunities for problem-solving.",
      ],
    },
    {
      emotion: "Annoyed",
      tips: [
        "Feeling annoyed is like when something keeps bothering you, and you wish it would stop.",
        "Take a break and find a peaceful place to relax. Sometimes, a little quiet time can make the annoyances go away.",
      ],
    },
    {
      emotion: "Angry",
      tips: [
        "Feeling angry is when you're really, really mad about something, and you might want to stomp your feet or yell.",
        "It's okay to feel angry, but try to talk about your feelings instead of yelling. Take deep breaths to calm down and find ways to solve problems.",
      ],
    },
  ];
export default emotionsExplained;