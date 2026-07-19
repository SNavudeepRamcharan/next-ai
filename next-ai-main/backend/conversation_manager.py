from collections import defaultdict

class ConversationManager:
    def __init__(self):
        self.conversations = defaultdict(list)

    def get_messages(self, chat_id):
        return self.conversations[chat_id]

    def add_message(self, chat_id, role, content):
        self.conversations[chat_id].append({
            "role": role,
            "content": content
        })

    def clear_chat(self, chat_id):
        self.conversations[chat_id] = []

conversation_manager = ConversationManager()