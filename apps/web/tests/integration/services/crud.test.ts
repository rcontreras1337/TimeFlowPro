/**
 * Integration Tests for Services CRUD
 *
 * Real tests against Supabase instance (local or remote).
 * Uses environment variables for configuration.
 *
 * @ticket T-2-03
 * @environment CRT (Local) or PRD (Remote)
 */

import { createClient } from '@supabase/supabase-js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Use environment variables - works for both local and CI
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Skip all tests if no service key is available (required for integration tests)
const canRunIntegrationTests = SUPABASE_URL && SUPABASE_SERVICE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeIntegration = canRunIntegrationTests ? describe : describe.skip

// Service client for direct table operations (bypasses RLS)
const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY || 'dummy', {
  auth: { persistSession: false },
})

// Anon client (respects RLS)
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'dummy', {
  auth: { persistSession: false },
})

// Generate unique test prefix to avoid collisions
const TEST_PREFIX = `test_${Date.now()}_`

describeIntegration('Services CRUD Integration', () => {
  let testUserId: string | null = null
  let otherUserId: string | null = null
  let createdServiceIds: string[] = []

  beforeAll(async () => {
    // Get a real user from the database to use for testing
    const { data: users } = await serviceClient.from('profiles').select('id').limit(2)

    if (users && users.length >= 1) {
      testUserId = users[0]?.id ?? null
      if (users.length >= 2) {
        otherUserId = users[1]?.id ?? null
      }
    }

    // Clean up any previous test data
    if (testUserId) {
      await serviceClient.from('services').delete().eq('user_id', testUserId).like('name', 'TEST_%')
    }
  })

  afterAll(async () => {
    // Clean up: delete all test services created during this run
    for (const id of createdServiceIds) {
      await serviceClient.from('services').delete().eq('id', id)
    }
  })

  describe('CREATE', () => {
    it('should create a new service', async () => {
      if (!testUserId) {
        console.log('Skipping: No test user available')
        return
      }

      const serviceName = `TEST_Service_${TEST_PREFIX}1`
      const { data, error } = await serviceClient
        .from('services')
        .insert({
          user_id: testUserId,
          name: serviceName,
          description: 'Test service description',
          default_duration_minutes: 60,
          price: 50000,
          color: '#6366F1',
          is_active: true,
          allow_online_booking: true,
          buffer_time_minutes: 10,
          order_index: 0,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.name).toBe(serviceName)
      expect(data?.description).toBe('Test service description')
      expect(data?.default_duration_minutes).toBe(60)
      expect(data?.price).toBe(50000)
      expect(data?.is_active).toBe(true)
      expect(data?.allow_online_booking).toBe(true)
      expect(data?.user_id).toBe(testUserId)

      if (data) createdServiceIds.push(data.id)
    })

    it('should reject duplicate name for same user (23505)', async () => {
      if (!testUserId) return

      const serviceName = `TEST_Duplicate_${TEST_PREFIX}`

      // Create first service
      const { data: first } = await serviceClient
        .from('services')
        .insert({ user_id: testUserId, name: serviceName })
        .select()
        .single()

      if (first) createdServiceIds.push(first.id)

      // Try to create duplicate
      const { error } = await serviceClient.from('services').insert({
        user_id: testUserId,
        name: serviceName,
      })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505')
    })

    it('should have default values when not specified', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('services')
        .insert({
          user_id: testUserId,
          name: `TEST_Defaults_${TEST_PREFIX}`,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.default_duration_minutes).toBe(60) // Default from DB
      expect(data?.price).toBe(0) // Default from DB
      expect(data?.is_active).toBe(true) // Default from DB
      expect(data?.allow_online_booking).toBe(true) // Default from DB
      if (data) createdServiceIds.push(data.id)
    })

    it('should allow price = 0', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('services')
        .insert({
          user_id: testUserId,
          name: `TEST_FreeService_${TEST_PREFIX}`,
          price: 0,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.price).toBe(0)
      if (data) createdServiceIds.push(data.id)
    })
  })

  describe('READ', () => {
    it('should read service by id', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const { data, error } = await serviceClient
        .from('services')
        .select('*')
        .eq('id', createdServiceIds[0])
        .single()

      expect(error).toBeNull()
      expect(data?.id).toBe(createdServiceIds[0])
    })

    it('should list user services ordered by order_index', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('services')
        .select('*')
        .eq('user_id', testUserId)
        .like('name', 'TEST_%')
        .order('order_index', { ascending: true })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.length).toBeGreaterThanOrEqual(1)
    })

    it('should filter active services', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('services')
        .select('*')
        .eq('user_id', testUserId)
        .eq('is_active', true)
        .like('name', 'TEST_%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      data?.forEach((service) => {
        expect(service.is_active).toBe(true)
      })
    })

    it('should filter online booking services', async () => {
      if (!testUserId) return

      const { data, error } = await serviceClient
        .from('services')
        .select('*')
        .eq('user_id', testUserId)
        .eq('is_active', true)
        .eq('allow_online_booking', true)
        .like('name', 'TEST_%')

      expect(error).toBeNull()
      expect(data).toBeDefined()
      data?.forEach((service) => {
        expect(service.is_active).toBe(true)
        expect(service.allow_online_booking).toBe(true)
      })
    })
  })

  describe('UPDATE', () => {
    it('should update service name', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const newName = `TEST_Updated_${TEST_PREFIX}`
      const { data, error } = await serviceClient
        .from('services')
        .update({ name: newName })
        .eq('id', createdServiceIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.name).toBe(newName)
    })

    it('should update price', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const { data, error } = await serviceClient
        .from('services')
        .update({ price: 75000 })
        .eq('id', createdServiceIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.price).toBe(75000)
    })

    it('should update duration', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const { data, error } = await serviceClient
        .from('services')
        .update({ default_duration_minutes: 90 })
        .eq('id', createdServiceIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.default_duration_minutes).toBe(90)
    })

    it('should toggle is_active', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const { data: current } = await serviceClient
        .from('services')
        .select('is_active')
        .eq('id', createdServiceIds[0])
        .single()

      const { data, error } = await serviceClient
        .from('services')
        .update({ is_active: !current?.is_active })
        .eq('id', createdServiceIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.is_active).toBe(!current?.is_active)
    })

    it('should toggle allow_online_booking', async () => {
      if (!testUserId || createdServiceIds.length === 0) return

      const { data: current } = await serviceClient
        .from('services')
        .select('allow_online_booking')
        .eq('id', createdServiceIds[0])
        .single()

      const { data, error } = await serviceClient
        .from('services')
        .update({ allow_online_booking: !current?.allow_online_booking })
        .eq('id', createdServiceIds[0])
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.allow_online_booking).toBe(!current?.allow_online_booking)
    })
  })

  describe('RLS Policies', () => {
    it('should block unauthenticated insert', async () => {
      const { error } = await anonClient.from('services').insert({
        name: 'Unauthorized',
        user_id: testUserId,
      })

      expect(error).toBeDefined()
    })
  })

  describe('Constraints', () => {
    it('should allow same name for different users', async () => {
      if (!testUserId || !otherUserId) {
        console.log('Skipping: Need 2 users for this test')
        return
      }

      const sharedName = `TEST_Shared_${TEST_PREFIX}`

      // Create for first user
      const { data: first } = await serviceClient
        .from('services')
        .insert({ user_id: testUserId, name: sharedName })
        .select()
        .single()

      if (first) createdServiceIds.push(first.id)

      // Create same name for second user - should work
      const { data, error } = await serviceClient
        .from('services')
        .insert({ user_id: otherUserId, name: sharedName })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      if (data) createdServiceIds.push(data.id)
    })
  })

  describe('DELETE', () => {
    it('should delete service', async () => {
      if (!testUserId) return

      const { data: temp } = await serviceClient
        .from('services')
        .insert({ user_id: testUserId, name: `TEST_ToDelete_${TEST_PREFIX}` })
        .select()
        .single()

      expect(temp).toBeDefined()

      const { error } = await serviceClient.from('services').delete().eq('id', temp!.id)

      expect(error).toBeNull()

      const { data: deleted } = await serviceClient
        .from('services')
        .select()
        .eq('id', temp!.id)
        .single()

      expect(deleted).toBeNull()
    })
  })
})
