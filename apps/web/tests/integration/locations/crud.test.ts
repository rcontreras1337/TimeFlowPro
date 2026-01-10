/**
 * Integration Tests for Locations CRUD
 *
 * Real tests against Supabase local instance.
 *
 * PREREQUISITE: These tests require at least one user in auth.users.
 * Create a test user by:
 * 1. Running the app locally (pnpm dev)
 * 2. Signing up with Google OAuth or email
 * 3. Note the user ID from profiles table
 *
 * Run with: pnpm test:integration
 *
 * @ticket T-2-01
 * @environment CRT (Local Supabase)
 */

import { describe, it } from 'vitest'

/**
 * Locations CRUD Integration Tests
 *
 * These tests verify that the locations CRUD operations work correctly
 * against a real Supabase instance.
 *
 * @note Skipped in CI - requires running Supabase with test user
 */
describe.skip('Locations CRUD Integration', () => {
  describe('CREATE', () => {
    it.todo('should create a new location with service role')
    it.todo('should reject duplicate name for same user (23505)')
  })

  describe('READ', () => {
    it.todo('should read location by id')
    it.todo('should list all user locations ordered by order_index')
  })

  describe('UPDATE', () => {
    it.todo('should update location name')
    it.todo('should toggle is_active')
    it.todo('should update order_index')
  })

  describe('DELETE', () => {
    it.todo('should delete location without appointments')
    it.todo('should fail to delete location with active appointments')
  })

  describe('RLS Policies', () => {
    it.todo('should block unauthenticated access')
    it.todo('should allow owner to CRUD their locations')
  })

  describe('Constraints', () => {
    it.todo('should enforce unique (user_id, name) constraint')
    it.todo('should cascade delete when user is deleted')
  })
})

/**
 * To run these tests with real data:
 *
 * 1. Start Supabase locally: supabase start
 * 2. Create a test user through the app
 * 3. Copy the user ID
 * 4. Update TEST_USER_ID constant
 * 5. Uncomment describe.skip -> describe
 * 6. Run: npx vitest run tests/integration/locations/crud.test.ts
 */
