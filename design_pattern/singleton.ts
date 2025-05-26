// Base Singleton class - Thread-safe and generic implementation
abstract class Singleton {
    private static instances: Map<string, any> = new Map();

    protected constructor() {
        const className = this.constructor.name;
        if (Singleton.instances.has(className)) {
            throw new Error(`An instance of ${className} already exists. Use getInstance() instead.`);
        }
        Singleton.instances.set(className, this);
    }

    public static getInstance<T extends Singleton>(this: new () => T): T {
        const className = this.name;
        if (!Singleton.instances.has(className)) {
            new this();
        }
        return Singleton.instances.get(className) as T;
    }

    // Reset specific singleton instance (useful for testing)
    public static resetInstance<T extends Singleton>(this: new () => T): void {
        Singleton.instances.delete(this.name);
    }

    // Clear all singleton instances (for test environment cleanup)
    public static resetAllInstances(): void {
        Singleton.instances.clear();
    }
}

// Example 1: Database Connection Manager
class DatabaseManager extends Singleton {
    private connection: string | null = null;
    private isConnected = false;

    private constructor() {
        super();
        this.initialize();
    }

    public static getInstance(): DatabaseManager {
        return super.getInstance.call(this);
    }

    private initialize(): void {
        console.log('DatabaseManager initialized');
    }

    public connect(connectionString: string): void {
        if (!this.isConnected) {
            this.connection = connectionString;
            this.isConnected = true;
            console.log(`Connected to database: ${connectionString}`);
        } else {
            console.log('Already connected to the database');
        }
    }

    public disconnect(): void {
        if (this.isConnected) {
            this.connection = null;
            this.isConnected = false;
            console.log('Disconnected from the database');
        }
    }

    public query(sql: string): string[] {
        if (!this.isConnected) {
            throw new Error('Database is not connected');
        }
        console.log(`Executing query: ${sql}`);
        return [`Result for: ${sql}`];
    }

    public getConnectionStatus(): { connected: boolean; connection: string | null } {
        return {
            connected: this.isConnected,
            connection: this.connection,
        };
    }
}

// Example 2: Logger Service
enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: string;
}

class Logger extends Singleton {
    private logs: LogEntry[] = [];
    private logLevel: LogLevel = LogLevel.INFO;
    private maxLogs = 1000;

    private constructor() {
        super();
    }

    public static getInstance(): Logger {
        return super.getInstance.call(this);
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public setMaxLogs(max: number): void {
        this.maxLogs = max;
    }

    private addLog(level: LogLevel, message: string, context?: string): void {
        if (level >= this.logLevel) {
            const entry: LogEntry = {
                timestamp: new Date(),
                level,
                message,
                context
            };

            this.logs.push(entry);

            // Enforce max log limit
            if (this.logs.length > this.maxLogs) {
                this.logs = this.logs.slice(-this.maxLogs);
            }

            const levelName = LogLevel[level];
            const contextText = context ? ` [${context}]` : '';
            console.log(`[${entry.timestamp.toISOString()}] ${levelName}${contextText}: ${message}`);
        }
    }

    public debug(message: string, context?: string): void {
        this.addLog(LogLevel.DEBUG, message, context);
    }

    public info(message: string, context?: string): void {
        this.addLog(LogLevel.INFO, message, context);
    }

    public warn(message: string, context?: string): void {
        this.addLog(LogLevel.WARN, message, context);
    }

    public error(message: string, context?: string): void {
        this.addLog(LogLevel.ERROR, message, context);
    }

    public getLogs(level?: LogLevel): LogEntry[] {
        return level !== undefined
            ? this.logs.filter(log => log.level === level)
            : [...this.logs];
    }

    public clearLogs(): void {
        this.logs = [];
    }
}

// Example 3: Configuration Manager
interface AppConfig {
    apiUrl: string;
    timeout: number;
    retryAttempts: number;
    debugMode: boolean;
    features: Record<string, boolean>;
}

class ConfigManager extends Singleton {
    private config: Partial<AppConfig> = {};
    private readonly defaultConfig: AppConfig = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retryAttempts: 3,
        debugMode: false,
        features: {}
    };

    private constructor() {
        super();
        this.loadDefaults();
    }

    public static getInstance(): ConfigManager {
        return super.getInstance.call(this);
    }

    private loadDefaults(): void {
        this.config = { ...this.defaultConfig };
    }

    public set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
        this.config[key] = value;
    }

    public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
        const value = this.config[key];
        return value === undefined ? this.defaultConfig[key] : value;
    }

    public getAll(): AppConfig {
        return { ...this.defaultConfig, ...this.config };
    }

    public loadFromObject(overrides: Partial<AppConfig>): void {
        this.config = { ...this.config, ...overrides };
    }

    public loadFromJson(jsonString: string): void {
        try {
            const parsed = JSON.parse(jsonString);
            this.loadFromObject(parsed);
        } catch (err) {
            throw new Error(`Invalid JSON configuration: ${err}`);
        }
    }

    public reset(): void {
        this.loadDefaults();
    }

    public toggleFeature(featureName: string): boolean {
        const features = this.get('features');
        features[featureName] = !features[featureName];
        return features[featureName];
    }

    public isFeatureEnabled(featureName: string): boolean {
        return this.get('features')[featureName] || false;
    }
}

// Demonstration function
function demonstrateSingletonUsage(): void {
    console.log('=== Singleton Pattern Demonstration ===\n');

    // DatabaseManager
    console.log('1. DatabaseManager:');
    const db1 = DatabaseManager.getInstance();
    const db2 = DatabaseManager.getInstance();
    console.log('Same instance:', db1 === db2);

    db1.connect('postgresql://localhost:5432/mydb');
    console.log('Connection status:', db2.getConnectionStatus());
    db2.query('SELECT * FROM users');
    db1.disconnect();

    // Logger
    console.log('\n2. Logger:');
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    console.log('Same instance:', logger1 === logger2);

    logger1.setLogLevel(LogLevel.DEBUG);
    logger2.debug('Debug log');
    logger1.info('Info log');
    logger2.warn('Warning log');
    logger1.error('Error log');
    console.log('Total logs:', logger2.getLogs().length);

    // ConfigManager
    console.log('\n3. ConfigManager:');
    const config1 = ConfigManager.getInstance();
    const config2 = ConfigManager.getInstance();
    console.log('Same instance:', config1 === config2);

    config1.set('apiUrl', 'https://new-api.example.com');
    config1.set('debugMode', true);
    config1.toggleFeature('newUI');

    console.log('API URL:', config2.get('apiUrl'));
    console.log('Debug mode:', config2.get('debugMode'));
    console.log('Feature enabled:', config2.isFeatureEnabled('newUI'));
    console.log('Full config:', config1.getAll());
}

// Test to ensure direct instantiation is prevented
function testDirectInstantiation(): void {
    console.log('\n=== Testing Direct Instantiation ===');
    try {
        // This should throw an error, but TS will prevent it statically
        // const directDb = new DatabaseManager();
        console.log('Direct instantiation prevented by TypeScript');
    } catch (err) {
        console.log('Error caught:', err);
    }
}

// Export
export {
    Singleton,
    DatabaseManager,
    Logger,
    LogLevel,
    ConfigManager,
    demonstrateSingletonUsage,
    testDirectInstantiation
};

// Example run
demonstrateSingletonUsage();
testDirectInstantiation();
