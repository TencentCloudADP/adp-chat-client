# Chat Configuration Guide

## Message Pagination

The chat system supports infinite message history with configurable pagination for optimal performance.

### Configuration

#### Environment Variable: `CHAT_MESSAGE_PAGE_SIZE`

Controls how many messages are loaded per request when browsing chat history.

**Default**: `100` (50 conversation rounds)

**Range**: `1` - `1000` (recommended: `50` - `500`)

#### How to Configure

Add to your `.env` file:

```bash
# Load 200 messages per request (100 conversation rounds)
CHAT_MESSAGE_PAGE_SIZE=200

# For slower networks, use smaller values
CHAT_MESSAGE_PAGE_SIZE=50

# For fast networks and powerful devices
CHAT_MESSAGE_PAGE_SIZE=500
```

### How It Works

1. **Infinite Storage**: All messages are permanently stored in the database
2. **Pagination Loading**: Messages are loaded in chunks for better performance
3. **Infinite Scroll**: Frontend automatically loads more messages when scrolling up
4. **Auto-Stop**: Loading stops when no more messages are available

### Performance Considerations

| Page Size | Pros | Cons |
|-----------|------|------|
| 50-100 | Fast loading, responsive UI | More API requests |
| 200-300 | Balanced performance | Moderate memory usage |
| 500+ | Fewer requests | Slower initial load, higher memory |

### Troubleshooting

#### Messages Not Loading
- Check server logs for database connection issues
- Verify `CHAT_MESSAGE_PAGE_SIZE` is a valid number
- Restart server after changing configuration

#### Slow Performance
- Reduce `CHAT_MESSAGE_PAGE_SIZE` value
- Check database performance and indexing
- Monitor network latency

#### Memory Issues
- Reduce `CHAT_MESSAGE_PAGE_SIZE` to 50 or lower
- Clear browser cache
- Check for memory leaks in frontend

### Database Schema

Messages are stored in the `chat_record` table:

```sql
CREATE TABLE chat_record (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ConversationId UUID NOT NULL,
    Content TEXT NOT NULL,
    FromRole VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conversation_created (ConversationId, CreatedAt)
);
```

### API Endpoints

#### Load Messages
```
GET /chat/messages?ConversationId={id}&LastRecordId={id}
```

**Parameters**:
- `ConversationId`: Required, conversation UUID
- `LastRecordId`: Optional, for pagination (load messages before this record)

**Response**:
```json
{
  "Response": {
    "ApplicationId": "string",
    "Records": [
      {
        "RecordId": "uuid",
        "Content": "string",
        "IsFromSelf": boolean,
        "CreatedAt": timestamp
      }
    ]
  }
}
```

### Best Practices

1. **Default Configuration**: Start with `CHAT_MESSAGE_PAGE_SIZE=100`
2. **Monitor Performance**: Adjust based on your server capacity and user needs
3. **Database Maintenance**: Regularly check database performance and optimize if needed
4. **Backup Strategy**: Implement regular backups for chat history
5. **Archival Policy**: Consider archiving very old conversations if storage becomes an issue

### Vendor Differences

- **Tencent ADP**: Uses cloud API, messages managed by Tencent
- **OpenAI/Ollama**: Uses local database, full control over message storage
- **All Vendors**: Support the same pagination and infinite scroll interface