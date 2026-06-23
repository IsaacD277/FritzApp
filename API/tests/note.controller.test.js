const mockNoteMethods = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn()
};


jest.mock('../src/common/models/Note', () => {
    return jest.fn(() => mockNoteMethods);
});

const noteController = require('../src/note/controller');
const e = require("express");
const {updateNote} = require("../src/note/controller");


describe('Note Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 201 and create a new note', async () => {
        const currentDate = new Date();
        const mockNote = {
            id: 1,
            userId: 42,
            description: 'Groomed, rode, and washed Fritz.',
            timeRidden: 120,
            createdAt: currentDate,
            updatedAt: currentDate,
            eventDate: "2026-06-23T19:57:00.000Z"
        };

        mockNoteMethods.create.mockResolvedValue(mockNote);

        const req = { body: { userId: 42, eventDate: "2026-06-23T19:57:00.000Z", description: "Groomed, rode, and washed Fritz." }}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.createNote(req, res);

        expect(mockNoteMethods.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 42 }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockNote
        });
    });

    describe('should return 400 Error status code and specify the error in the response body', () => {
        it('should return 400 Error status code and specify the invalid userId', async () => {
            const currentDate = new Date();
            const mockNote = {
                id: 1,
                userId: 42,
                description: 'Groomed, rode, and washed Fritz.',
                timeRidden: 120,
                createdAt: currentDate,
                updatedAt: currentDate,
                eventDate: "2026-06-23T19:57:00.000Z"
            };

            mockNoteMethods.create.mockResolvedValue(mockNote);

            const req = { body: { eventDate: "2026-06-23T19:57:00", userId: '42' }}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'userId must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid timeRidden', async () => {
            const currentDate = new Date();
            const mockNote = {
                id: 1,
                userId: 42,
                description: 'Groomed, rode, and washed Fritz.',
                timeRidden: 120,
                createdAt: currentDate,
                updatedAt: currentDate,
                eventDate: "2026-06-23T19:57:00.000Z"
            };

            mockNoteMethods.create.mockResolvedValue(mockNote);

            const req = { 
                body: { 
                    userId: 42, 
                    description: 'Groomed, rode, and washed Fritz.', 
                    timeRidden: '120',
                    eventDate: "2026-06-23T19:57:00.000Z" 
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'timeRidden must be a number'}))
        });

        it('should return 400 Error status code and specify the invalid eventDate', async () => {
            const currentDate = new Date();
            const mockNote = {
                id: 1,
                userId: 42,
                description: 'Groomed, rode, and washed Fritz.',
                timeRidden: 120,
                createdAt: currentDate,
                updatedAt: currentDate,
                eventDate: "2026-06-23T19:57:00.000Z"
            };

            mockNoteMethods.create.mockResolvedValue(mockNote);

            const req = { 
                body: {
                    id: 1,
                    userId: 42,
                    description: 'Groomed, rode, and washed Fritz.',
                    timeRidden: 120,
                    createdAt: currentDate,
                    updatedAt: currentDate,
                    eventDate: "06-23-2026"
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'eventDate must be an ISO date string'}))
        });

        it('should return 400 Error status code and specify the invalid description', async () => {
            const req = { 
                body: {
                    id: 1,
                    userId: 42,
                    description: 14,
                    timeRidden: 120,
                    eventDate: "2026-06-23T19:57:00.000Z"
                }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'description must be a string'}))
        });
    });

    it('should return 200 and a matching note when given a valid ID', async () => {
        const currentDate = new Date();
        const mockNote = {
            id: 1,
            userId: 42,
            description: 'Groomed, rode, and washed Fritz.',
            timeRidden: 120,
            createdAt: currentDate,
            updatedAt: currentDate,
            eventDate: "2026-06-23T19:57:00.000Z"
        };

        mockNoteMethods.findByPk.mockResolvedValue(mockNote);

        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.getNote(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ id: 1, userId: 42, timeRidden: 120 })}));
    });

    it('should return 404 when no note matches the provided ID', async () => {
        mockNoteMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.getNote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Note not found'}))
    });

    it('should return 200 and a list of all notes', async () => {
        const currentDate = new Date();
        const mockNotes = [
            {
                id: 1,
                userId: 42,
                description: 'Groomed, rode, and washed Fritz.',
                timeRidden: 120,
                createdAt: currentDate,
                updatedAt: currentDate,
                eventDate: "2026-06-23T19:57:00.000Z"
            },
            {
                id: 2,
                userId: 42,
                description: 'Groomed, rode, and washed Fritz.',
                timeRidden: 100,
                createdAt: currentDate,
                updatedAt: currentDate,
                eventDate: "2026-06-23T19:57:00.000Z"
            }
        ];
        mockNoteMethods.findAll.mockResolvedValue(mockNotes);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.getAllNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.arrayContaining(mockNotes) }));
    });

    it('should return 200 and an empty list when no notes exist', async () => {
        const mockNotes = [];
        mockNoteMethods.findAll.mockResolvedValue(mockNotes);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.getAllNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.arrayContaining([]) }));
    });

    it('should return 200 and update the correct fields', async () => {
        const currentDate = new Date();
        const mockNote = {
            id: 1,
            userId: 42,
            description: 'Groomed, rode, and washed Fritz.',
            timeRidden: 120,
            createdAt: currentDate,
            updatedAt: currentDate,
            eventDate: "2026-06-23T19:57:00.000Z",
            save: jest.fn().mockResolvedValue(true)
        };
        const saveSpy = jest.spyOn(mockNote, 'save');
        mockNoteMethods.findByPk.mockResolvedValue(mockNote);

        const req = { params: { id: 1 }, body: { description: "Gave Fritz the drugs" } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.updateNote(req, res);

        expect(saveSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ description: "Gave Fritz the drugs", userId: 42 }) }));
    });

    it('should return 404 when no note matches the provided ID', async () => {
        mockNoteMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 }, body: { status: 3 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.updateNote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Note not found' }));
    });

    it('should return 204 and delete the note', async () => {
        const currentDate = new Date();
        const mockNote = {
            id: 1,
            userId: 42,
            description: 'Groomed, rode, and washed Fritz.',
            timeRidden: 120,
            createdAt: currentDate,
            updatedAt: currentDate,
            eventDate: "2026-06-23T19:57:00.000Z",
            destroy: jest.fn().mockResolvedValue(true)
        };
        const destroySpy = jest.spyOn(mockNote, 'destroy');
        mockNoteMethods.findByPk.mockResolvedValue(mockNote);

        const req = { params: { id: 1 } }
        const res = {
            status: jest.fn().mockReturnThis()
        };

        await noteController.deleteNote(req, res);

        expect(destroySpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 when no note matches the provided ID', async () => {
        mockNoteMethods.findByPk.mockResolvedValue(null);

        const req = { params: { id: 999 } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await noteController.deleteNote(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'No notes found for the provided `id`' }));
    });
});