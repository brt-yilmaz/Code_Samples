// Command interface - defines the contract for all commands
interface ICommand {
  execute(): void;
  undo(): void;
  serialize(): CommandData;
}

// Data structure for serializing commands
interface CommandData {
  type: string;
  data: any;
}

// Document class - the receiver that performs actual operations
class Document {
  private content: string = '';
  private cursor: number = 0;

  getText(): string {
    return this.content;
  }

  getCursor(): number {
    return this.cursor;
  }

  setCursor(position: number): void {
    this.cursor = Math.max(0, Math.min(position, this.content.length));
  }

  insertText(text: string, position: number): void {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
    this.cursor = position + text.length;
  }

  deleteText(startPos: number, length: number): string {
    const deletedText = this.content.slice(startPos, startPos + length);
    this.content = this.content.slice(0, startPos) + this.content.slice(startPos + length);
    this.cursor = startPos;
    return deletedText;
  }

  replaceText(startPos: number, length: number, newText: string): string {
    const oldText = this.content.slice(startPos, startPos + length);
    this.content = this.content.slice(0, startPos) + newText + this.content.slice(startPos + length);
    this.cursor = startPos + newText.length;
    return oldText;
  }

  getLength(): number {
    return this.content.length;
  }
}

// Concrete command implementations
class InsertTextCommand implements ICommand {
  constructor(
    private document: Document,
    private text: string,
    private position: number
  ) {}

  execute(): void {
    this.document.insertText(this.text, this.position);
  }

  undo(): void {
    this.document.deleteText(this.position, this.text.length);
  }

  serialize(): CommandData {
    return {
      type: 'InsertText',
      data: { text: this.text, position: this.position }
    };
  }

  static deserialize(document: Document, data: any): InsertTextCommand {
    return new InsertTextCommand(document, data.text, data.position);
  }
}

class DeleteTextCommand implements ICommand {
  private deletedText: string = '';

  constructor(
    private document: Document,
    private startPosition: number,
    private length: number
  ) {}

  execute(): void {
    this.deletedText = this.document.deleteText(this.startPosition, this.length);
  }

  undo(): void {
    this.document.insertText(this.deletedText, this.startPosition);
  }

  serialize(): CommandData {
    return {
      type: 'DeleteText',
      data: { 
        startPosition: this.startPosition, 
        length: this.length,
        deletedText: this.deletedText 
      }
    };
  }

  static deserialize(document: Document, data: any): DeleteTextCommand {
    const command = new DeleteTextCommand(document, data.startPosition, data.length);
    command.deletedText = data.deletedText || '';
    return command;
  }
}

class ReplaceTextCommand implements ICommand {
  private oldText: string = '';

  constructor(
    private document: Document,
    private startPosition: number,
    private length: number,
    private newText: string
  ) {}

  execute(): void {
    this.oldText = this.document.replaceText(this.startPosition, this.length, this.newText);
  }

  undo(): void {
    this.document.replaceText(this.startPosition, this.newText.length, this.oldText);
  }

  serialize(): CommandData {
    return {
      type: 'ReplaceText',
      data: {
        startPosition: this.startPosition,
        length: this.length,
        newText: this.newText,
        oldText: this.oldText
      }
    };
  }

  static deserialize(document: Document, data: any): ReplaceTextCommand {
    const command = new ReplaceTextCommand(document, data.startPosition, data.length, data.newText);
    command.oldText = data.oldText || '';
    return command;
  }
}

// Macro command for batch operations
class MacroCommand implements ICommand {
  constructor(private commands: ICommand[]) {}

  execute(): void {
    this.commands.forEach(command => command.execute());
  }

  undo(): void {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  serialize(): CommandData {
    return {
      type: 'Macro',
      data: { commands: this.commands.map(cmd => cmd.serialize()) }
    };
  }

  static deserialize(document: Document, data: any): MacroCommand {
    const commands = data.commands.map((cmdData: CommandData) => 
      CommandFactory.deserialize(document, cmdData)
    );
    return new MacroCommand(commands);
  }
}

// Factory for creating commands from serialized data
class CommandFactory {
  static deserialize(document: Document, data: CommandData): ICommand {
    switch (data.type) {
      case 'InsertText':
        return InsertTextCommand.deserialize(document, data.data);
      case 'DeleteText':
        return DeleteTextCommand.deserialize(document, data.data);
      case 'ReplaceText':
        return ReplaceTextCommand.deserialize(document, data.data);
      case 'Macro':
        return MacroCommand.deserialize(document, data.data);
      default:
        throw new Error(`Unknown command type: ${data.type}`);
    }
  }
}

// Command Manager - handles execution, undo/redo, and persistence
class CommandManager {
  private history: ICommand[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 100;

  constructor(private document: Document) {}

  execute(command: ICommand): void {
    // Remove any commands after current index (when we execute after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Execute the command
    command.execute();
    
    // Add to history
    this.history.push(command);
    this.currentIndex++;
    
    // Maintain max history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): boolean {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.canRedo()) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  // Store command history to JSON
  store(): string {
    const executedCommands = this.history.slice(0, this.currentIndex + 1);
    const serializedHistory = executedCommands.map(command => command.serialize());
    return JSON.stringify({
      documentContent: this.document.getText(),
      documentCursor: this.document.getCursor(),
      commandHistory: serializedHistory,
      currentIndex: this.currentIndex
    });
  }

  // Load command history from JSON
  load(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      // Restore document state
      this.document['content'] = data.documentContent || '';
      this.document.setCursor(data.documentCursor || 0);
      
      // Restore command history
      this.history = data.commandHistory.map((cmdData: CommandData) => 
        CommandFactory.deserialize(this.document, cmdData)
      );
      
      this.currentIndex = data.currentIndex;
    } catch (error) {
      throw new Error(`Failed to load command history: ${error}`);
    }
  }

  getHistoryInfo(): { total: number; current: number; canUndo: boolean; canRedo: boolean } {
    return {
      total: this.history.length,
      current: this.currentIndex + 1,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}

// Text Editor - the main application class (Invoker)
class TextEditor {
  private commandManager: CommandManager;

  constructor(private document: Document) {
    this.commandManager = new CommandManager(document);
  }

  // High-level operations
  insertText(text: string, position?: number): void {
    const pos = position ?? this.document.getCursor();
    const command = new InsertTextCommand(this.document, text, pos);
    this.commandManager.execute(command);
  }

  deleteText(startPos: number, length: number): void {
    const command = new DeleteTextCommand(this.document, startPos, length);
    this.commandManager.execute(command);
  }

  replaceText(startPos: number, length: number, newText: string): void {
    const command = new ReplaceTextCommand(this.document, startPos, length, newText);
    this.commandManager.execute(command);
  }

  // Find and replace operation using macro command
  findAndReplaceAll(searchText: string, replaceText: string): void {
    const commands: ICommand[] = [];
    const content = this.document.getText();
    let index = content.indexOf(searchText);
    let offset = 0;

    while (index !== -1) {
      const adjustedIndex = index + offset;
      commands.push(new ReplaceTextCommand(
        this.document, 
        adjustedIndex, 
        searchText.length, 
        replaceText
      ));
      
      offset += replaceText.length - searchText.length;
      index = content.indexOf(searchText, index + 1);
    }

    if (commands.length > 0) {
      const macroCommand = new MacroCommand(commands);
      this.commandManager.execute(macroCommand);
    }
  }

  undo(): boolean {
    return this.commandManager.undo();
  }

  redo(): boolean {
    return this.commandManager.redo();
  }

  getText(): string {
    return this.document.getText();
  }

  getCursor(): number {
    return this.document.getCursor();
  }

  setCursor(position: number): void {
    this.document.setCursor(position);
  }

  // Persistence operations
  saveSession(): string {
    return this.commandManager.store();
  }

  loadSession(sessionData: string): void {
    this.commandManager.load(sessionData);
  }

  getStatus(): string {
    const info = this.commandManager.getHistoryInfo();
    return `Document: ${this.document.getLength()} chars | ` +
           `History: ${info.current}/${info.total} | ` +
           `Undo: ${info.canUndo} | Redo: ${info.canRedo}`;
  }
}

// Demo usage
function demonstrateTextEditor() {
  console.log('=== Text Editor Command Pattern Demo ===\n');
  
  // Create editor
  const document = new Document();
  const editor = new TextEditor(document);
  
  console.log('1. Initial state:');
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  // Perform operations
  console.log('2. Insert "Hello World"');
  editor.insertText('Hello World');
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  console.log('3. Insert " - Welcome!" at the end');
  editor.insertText(' - Welcome!');
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  console.log('4. Replace "Hello" with "Hi"');
  editor.replaceText(0, 5, 'Hi');
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  console.log('5. Undo last operation');
  editor.undo();
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  console.log('6. Undo again');
  editor.undo();
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  console.log('7. Redo');
  editor.redo();
  console.log(`Content: "${editor.getText()}"`);
  console.log(`Status: ${editor.getStatus()}\n`);
  
  // Save session
  console.log('8. Save session');
  const sessionData = editor.saveSession();
  console.log('Session saved (JSON data length):', sessionData.length, 'characters\n');
  
  // Create new editor and load session
  console.log('9. Create new editor and load session');
  const newDocument = new Document();
  const newEditor = new TextEditor(newDocument);
  newEditor.loadSession(sessionData);
  console.log(`Loaded Content: "${newEditor.getText()}"`);
  console.log(`Loaded Status: ${newEditor.getStatus()}\n`);
  
  // Test find and replace
  console.log('10. Find and replace all "o" with "0"');
  newEditor.findAndReplaceAll('o', '0');
  console.log(`Content: "${newEditor.getText()}"`);
  console.log(`Status: ${newEditor.getStatus()}\n`);
  
  console.log('11. Undo find and replace');
  newEditor.undo();
  console.log(`Content: "${newEditor.getText()}"`);
  console.log(`Status: ${newEditor.getStatus()}`);
}

// Run the demonstration
demonstrateTextEditor();