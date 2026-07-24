- [ ] Diagnose 401 cause by checking auth middleware + token usage
- [x] Verify PlaceOrder sends Authorization header using token from StoreContext
- [x] Check backend JWT_SECRET presence at runtime
- [x] Add clearer auth error when JWT_SECRET is missing
- [ ] Set JWT_SECRET in backend .env (and restart server)
- [ ] Retry place-order request to confirm 401 resolved

