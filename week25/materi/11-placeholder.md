# Testing Controllers

## 🤔 What is a Controller?

Controller = Layer yang handle **HTTP requests/responses**.

```
HTTP Request → Controller → Service → Repository → Database
                    ↓
              HTTP Response
```

---

## 🧪 Unit Testing Controllers

### Controller Code
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
```

### Unit Test
```typescript
describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const users = [{ id: 1, name: 'John' }];
      service.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: 1, name: 'John' };
      service.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');

      expect(result).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John', email: 'john@email.com' };
      const created = { id: 1, ...dto };
      service.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
```

---

## 📝 Summary

**Controller Tests:**
- ✅ Test request handling
- ✅ Test parameter extraction
- ✅ Test response formatting
- ✅ Mock service layer
- ❌ Don't test HTTP details (use E2E for that)

---

## 🔗 Next Steps
- **Materi 12:** Integration Testing (E2E)
- **Materi 13:** Testing Best Practices
