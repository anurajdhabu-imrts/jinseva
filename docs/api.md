# API Reference

Base URL: `http://localhost:5000/api/v1`

## Auth

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/login` | Login with email + password, returns JWT |
| POST | `/auth/register` | Register a new devotee |
| POST | `/auth/forgot-password` | Send OTP to email |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/reset-password` | Reset password with valid OTP |
| GET | `/auth/me` | Current authenticated user (Bearer required) |

## Donations

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/donations` | Public (devotees can donate without login) |
| GET | `/donations` | `admin` / `accountant` |
| GET | `/donations/analytics` | `admin` / `accountant` |
| GET | `/donations/:id` | `admin` / `accountant` |
| PATCH | `/donations/:id` | `admin` / `accountant` |
| DELETE | `/donations/:id` | `admin` |

## Income / Expenses

Same CRUD shape for `/income/*` and `/expenses/*` — both gated to `admin` and `accountant`.

## Events

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/events` | Public |
| GET | `/events/:id` | Public |
| POST | `/events` | `admin` |
| PATCH | `/events/:id` | `admin` |
| DELETE | `/events/:id` | `admin` |
| GET | `/events/:id/donations` | `admin` / `accountant` |
| GET | `/events/:id/expenses` | `admin` / `accountant` |

## Bookings, Inventory, Staff, Communication, Reports, Settings

See `apps/backend/src/routes/` — each file mirrors the same role-gated REST shape.

## Auth header

```
Authorization: Bearer <token>
```

## Error response shape

```json
{
  "success": false,
  "message": "Human-readable error",
  "stack": "…only in non-production"
}
```
